import logging
import tempfile
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlsplit, urlunsplit
import httpx


MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024
logger = logging.getLogger(__name__)


class CloudStorageDownloadError(Exception):
    pass


class CloudStorageAuthenticationError(CloudStorageDownloadError):
    pass


class InvalidCloudStorageUrlError(ValueError):
    pass


def _redact_signed_url(url: str) -> str:
    parts = urlsplit(url)
    sensitive_keys = {"api_key", "signature", "timestamp", "expires_at"}
    query = urlencode(
        [
            (key, "[redacted]" if key in sensitive_keys else value)
            for key, value in parse_qsl(parts.query, keep_blank_values=True)
        ]
    )
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, parts.fragment))


def download_file_from_url(file_url: str, original_name: str) -> Path:
    parsed_url = urlparse(file_url)

    if parsed_url.scheme != "https":
        raise InvalidCloudStorageUrlError("Knowledge file URL must use HTTPS")

    hostname = (parsed_url.hostname or "").lower()

    if hostname != "cloudinary.com" and not hostname.endswith(".cloudinary.com"):
        raise InvalidCloudStorageUrlError("Knowledge file URL must be hosted by Cloudinary")

    suffix = Path(original_name).suffix.lower() or ".txt"

    temp_path: Path | None = None

    logger.info(
        "Starting Cloudinary download url=%s original_name=%s host=%s",
        _redact_signed_url(file_url),
        original_name,
        hostname,
    )

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_path = Path(temp_file.name)

            with httpx.stream("GET", file_url, follow_redirects=True, timeout=30.0) as response:
                logger.info(
                    "Cloud storage download response host=%s status_code=%s content_type=%s content_length=%s final_url=%s",
                    hostname,
                    response.status_code,
                    response.headers.get("content-type"),
                    response.headers.get("content-length"),
                    _redact_signed_url(str(response.url)),
                )

                if response.status_code in (401, 403):
                    raise CloudStorageAuthenticationError(
                        "Cloudinary Authentication Error: file is not publicly deliverable "
                        f"or the signed processing URL is invalid. status={response.status_code} "
                        f"url={_redact_signed_url(file_url)}"
                    )

                if response.is_error:
                    raise CloudStorageDownloadError(
                        "Download Failed: Cloudinary returned "
                        f"status {response.status_code} for url={_redact_signed_url(file_url)}"
                    )

                downloaded_bytes = 0

                for chunk in response.iter_bytes():
                    downloaded_bytes += len(chunk)

                    if downloaded_bytes > MAX_DOWNLOAD_BYTES:
                        raise ValueError("Knowledge file exceeds the 25 MB download limit")

                    temp_file.write(chunk)

        return temp_path
    except httpx.HTTPError as error:
        if temp_path:
            temp_path.unlink(missing_ok=True)

        logger.exception(
            "Cloudinary fetch failed url=%s original_name=%s error=%s",
            _redact_signed_url(file_url),
            original_name,
            repr(error),
        )
        raise CloudStorageDownloadError(
            f"Download Failed: fetch failed for Cloudinary URL. error={error!r}"
        ) from error
    except Exception:
        if temp_path:
            temp_path.unlink(missing_ok=True)

        raise
