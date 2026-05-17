from functools import lru_cache
from app.config.settings import get_settings
from app.services.chunking_service import ChunkingService
from app.services.document_extractor import DocumentExtractor
from app.services.embedding_service import EmbeddingService
from app.services.qdrant_vector_store_service import QdrantVectorStoreService
from app.services.retrieval_service import RetrievalService


@lru_cache
def get_retrieval_service() -> RetrievalService:
    settings = get_settings()
    embedding_service = EmbeddingService(
        model_name=settings.embedding_model_name,
        batch_size=settings.embedding_batch_size,
    )

    return RetrievalService(
        document_extractor=DocumentExtractor(),
        chunking_service=ChunkingService(
            chunk_size_tokens=settings.chunk_size_tokens,
            chunk_overlap_tokens=settings.chunk_overlap_tokens,
        ),
        embedding_service=embedding_service,
        vector_store_service=QdrantVectorStoreService(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
            collection_prefix=settings.qdrant_collection_prefix,
            dimension=embedding_service.dimension,
        ),
    )
