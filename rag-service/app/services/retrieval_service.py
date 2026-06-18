from typing import Protocol
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.document_extractor import DocumentExtractor


class VectorStore(Protocol):
    def upsert_chunks(self, bot_id: str, chunks: list, embeddings) -> int:
        ...

    def search(self, bot_id: str, query_embedding, top_k: int) -> list[dict]:
        ...

    def delete_source(self, bot_id: str, source: str) -> None:
        ...


class RetrievalService:
    def __init__(
        self,
        document_extractor: DocumentExtractor,
        chunking_service: ChunkingService,
        embedding_service: EmbeddingService,
        vector_store_service: VectorStore,
    ):
        self.document_extractor = document_extractor
        self.chunking_service = chunking_service
        self.embedding_service = embedding_service
        self.vector_store_service = vector_store_service

    def ingest_document(self, bot_id: str, file_path, source: str) -> dict:
        text = self.document_extractor.extract_text(file_path=file_path, filename=source)
        chunks = self.chunking_service.chunk_text(text=text, bot_id=bot_id, source=source)

        if not chunks:
            return {
                "botId": bot_id,
                "source": source,
                "chunksCreated": 0,
                "vectorsStored": 0,
            }

        embeddings = self.embedding_service.embed_documents([chunk.text for chunk in chunks])
        vectors_stored = self.vector_store_service.upsert_chunks(bot_id, chunks, embeddings)

        return {
            "botId": bot_id,
            "source": source,
            "chunksCreated": len(chunks),
            "vectorsStored": vectors_stored,
        }

    def retrieve_context(self, bot_id: str, query: str, top_k: int) -> list[dict]:
        query_embedding = self.embedding_service.embed_query(query)
        return self.vector_store_service.search(bot_id, query_embedding, top_k)
