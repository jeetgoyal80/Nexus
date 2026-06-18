import tempfile
import logging
import time
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from app.config.settings import get_settings
from app.models.rag_models import (
    IngestResponse,
    IngestUrlRequest,
    DeleteSourceRequest,
    RetrieveContextRequest,
    RetrieveContextResponse,
    RetrievedContext,
)
from app.services.retrieval_service import RetrievalService
from app.services.service_factory import get_retrieval_service
from app.services.cloudinary_downloader import (
    CloudStorageAuthenticationError,
    CloudStorageDownloadError,
    InvalidCloudStorageUrlError,
    download_file_from_url,
)

router = APIRouter()
logger = logging.getLogger(__name__)


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


def _cleanup_temp_file(temp_path: Path | None) -> None:
    if temp_path is None:
        return

    for attempt in range(3):
        try:
            temp_path.unlink(missing_ok=True)
            return
        except PermissionError as error:
            if attempt == 2:
                logger.warning(
                    "Temporary file cleanup skipped because the file is still locked path=%s error=%s",
                    temp_path,
                    error,
                )
                return
            time.sleep(0.2)
        except OSError as error:
            logger.warning(
                "Temporary file cleanup failed path=%s error=%s",
                temp_path,
                error,
            )
            return


@router.get("/health")
def health():
    settings = get_settings()
    return {
        "success": True,
        "service": settings.app_name,
        "embeddingModel": settings.embedding_model_name,
    }


async def _ingest_upload(
    bot_id: str,
    file: UploadFile,
    retrieval_service: RetrievalService,
):
    suffix = Path(file.filename or "document").suffix or ".txt"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_path = Path(temp_file.name)
        temp_file.write(await file.read())

    try:
        return retrieval_service.ingest_document(
            bot_id=bot_id,
            file_path=temp_path,
            source=file.filename or f"uploaded{suffix}",
        )
    except Exception as error:
        logger.exception(
            "Document upload ingestion failed bot_id=%s filename=%s error=%s",
            bot_id,
            file.filename,
            error,
        )
        raise
    finally:
        _cleanup_temp_file(temp_path)


@router.post("/ingest/document", response_model=IngestResponse)
async def ingest_document(
    botId: str = Form(...),
    file: UploadFile = File(...),
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    return await _ingest_upload(botId, file, retrieval_service)


@router.post("/ingest/pdf", response_model=IngestResponse)
async def ingest_pdf(
    botId: str = Form(...),
    file: UploadFile = File(...),
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    return await _ingest_upload(botId, file, retrieval_service)


@router.post("/ingest/url", response_model=IngestResponse)
def ingest_url(
    payload: IngestUrlRequest,
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    logger.info(
        "Received URL ingestion request bot_id=%s original_name=%s source_id=%s file_url=%s",
        payload.botId,
        payload.originalName,
        payload.sourceId,
        _redact_signed_url(payload.fileUrl),
    )

    try:
        temp_path = download_file_from_url(payload.fileUrl, payload.originalName)
    except CloudStorageAuthenticationError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error
    except InvalidCloudStorageUrlError as error:
        raise HTTPException(status_code=400, detail=f"Invalid URL: {error}") from error
    except CloudStorageDownloadError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    try:
        return retrieval_service.ingest_document(
            bot_id=payload.botId,
            file_path=temp_path,
            source=payload.sourceId or payload.originalName,
        )
    except Exception as error:
        logger.exception(
            "URL ingestion processing failed bot_id=%s original_name=%s source_id=%s error=%s",
            payload.botId,
            payload.originalName,
            payload.sourceId,
            error,
        )
        raise HTTPException(status_code=500, detail=f"RAG processing failed: {error}") from error
    finally:
        _cleanup_temp_file(temp_path)


@router.post("/delete-source")
def delete_source(
    payload: DeleteSourceRequest,
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    retrieval_service.vector_store_service.delete_source(payload.botId, payload.source)
    return {"success": True}


@router.post("/retrieve-context", response_model=RetrieveContextResponse)
def retrieve_context(
    payload: RetrieveContextRequest,
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    settings = get_settings()
    matches = retrieval_service.retrieve_context(
        bot_id=payload.botId,
        query=payload.query,
        top_k=payload.topK or settings.default_top_k,
    )

    return RetrieveContextResponse(
        botId=payload.botId,
        query=payload.query,
        contexts=[match["text"] for match in matches],
        matches=[RetrievedContext(**match) for match in matches],
    )
