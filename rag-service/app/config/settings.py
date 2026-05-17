from functools import lru_cache
import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv


RAG_SERVICE_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(RAG_SERVICE_ROOT / ".env")


class Settings(BaseModel):
    app_name: str = "RAG Retrieval Service"
    embedding_model_name: str = "BAAI/bge-base-en-v1.5"
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str | None = None
    qdrant_collection_prefix: str = "bot_knowledge"
    chunk_size_tokens: int = 850
    chunk_overlap_tokens: int = 150
    embedding_batch_size: int = 16
    default_top_k: int = 5


@lru_cache
def get_settings() -> Settings:
    settings = Settings(
        qdrant_url=os.getenv("QDRANT_URL", "http://localhost:6333"),
        qdrant_api_key=os.getenv("QDRANT_API_KEY") or None,
        qdrant_collection_prefix=os.getenv("QDRANT_COLLECTION_PREFIX", "bot_knowledge"),
    )
    return settings
