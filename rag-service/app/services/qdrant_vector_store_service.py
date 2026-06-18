import hashlib
import uuid
from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance,
    FieldCondition,
    Filter,
    FilterSelector,
    MatchValue,
    PayloadSchemaType,
    PointStruct,
    VectorParams,
)
from app.services.chunking_service import TextChunk


class QdrantVectorStoreService:
    def __init__(
        self,
        url: str,
        api_key: str | None,
        collection_prefix: str,
        dimension: int,
    ):
        self.client = QdrantClient(url=url, api_key=api_key)
        self.collection_prefix = collection_prefix
        self.dimension = dimension

    def upsert_chunks(self, bot_id: str, chunks: list[TextChunk], embeddings) -> int:
        collection_name = self._collection_name(bot_id)
        self._ensure_collection(collection_name)

        points = []
        for chunk, embedding in zip(chunks, embeddings):
            point_id = self._point_id(bot_id, chunk.metadata.get("source"), chunk.chunk_index, chunk.text)
            points.append(
                PointStruct(
                    id=point_id,
                    vector=embedding.tolist(),
                    payload={
                        "botId": bot_id,
                        "text": chunk.text,
                        "chunkIndex": chunk.chunk_index,
                        "source": chunk.metadata.get("source"),
                    },
                )
            )

        if points:
            self.client.upsert(collection_name=collection_name, points=points)

        return len(points)

    def search(self, bot_id: str, query_embedding, top_k: int) -> list[dict]:
        collection_name = self._collection_name(bot_id)

        if not self.client.collection_exists(collection_name=collection_name):
            return []

        results = self.client.search(
            collection_name=collection_name,
            query_vector=query_embedding.tolist(),
            limit=top_k,
            with_payload=True,
        )

        matches: list[dict] = []
        for result in results:
            payload = result.payload or {}
            matches.append(
                {
                    "text": payload.get("text", ""),
                    "score": float(result.score),
                    "chunkIndex": payload.get("chunkIndex", 0),
                    "source": payload.get("source"),
                }
            )

        return matches

    def delete_source(self, bot_id: str, source: str) -> None:
        collection_name = self._collection_name(bot_id)

        if not self.client.collection_exists(collection_name=collection_name):
            return

        self._ensure_source_index(collection_name)

        self.client.delete(
            collection_name=collection_name,
            points_selector=FilterSelector(
                filter=Filter(
                    must=[
                        FieldCondition(
                            key="source",
                            match=MatchValue(value=source),
                        )
                    ]
                )
            ),
        )

    def _ensure_collection(self, collection_name: str) -> None:
        if not self.client.collection_exists(collection_name=collection_name):
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=self.dimension,
                    distance=Distance.COSINE,
                ),
            )

        self._ensure_source_index(collection_name)

    def _ensure_source_index(self, collection_name: str) -> None:
        self.client.create_payload_index(
            collection_name=collection_name,
            field_name="source",
            field_schema=PayloadSchemaType.KEYWORD,
        )

    def _collection_name(self, bot_id: str) -> str:
        safe_bot_id = "".join(char for char in bot_id if char.isalnum() or char in ("-", "_"))
        return f"{self.collection_prefix}_{safe_bot_id}"

    def _point_id(self, bot_id: str, source: str | None, chunk_index: int, text: str) -> str:
        raw = f"{bot_id}:{source or 'unknown'}:{chunk_index}:{text}"
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        return str(uuid.UUID(digest[:32]))
