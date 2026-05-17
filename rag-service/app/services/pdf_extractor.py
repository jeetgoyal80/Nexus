import re
from pathlib import Path
from pypdf import PdfReader


class PDFExtractor:
    def extract_text(self, file_path: Path) -> str:
        reader = PdfReader(str(file_path))
        pages: list[str] = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if text.strip():
                pages.append(f"\n\n[Page {page_number}]\n{text}")

        return self.clean_text("\n".join(pages))

    def clean_text(self, text: str) -> str:
        text = text.replace("\x00", " ")
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
        return text.strip()
