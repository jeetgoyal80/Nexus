from fastapi import FastAPI
from app.api.routes.rag_routes import router as rag_router
from app.config.settings import get_settings


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Stateless retrieval infrastructure for the No-Code AI Chatbot Builder platform.",
)

app.include_router(rag_router)
