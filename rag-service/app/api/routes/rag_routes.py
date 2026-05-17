import tempfile
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, UploadFile
from app.config.settings import get_settings
from app.models.rag_models import (
    IngestResponse,
    RetrieveContextRequest,
    RetrieveContextResponse,
    RetrievedContext,
)
from app.services.retrieval_service import RetrievalService
from app.services.service_factory import get_retrieval_service

router = APIRouter()


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
    finally:
        temp_path.unlink(missing_ok=True)


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
