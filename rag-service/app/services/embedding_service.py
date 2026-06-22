import numpy as np
from fastembed import TextEmbedding


class EmbeddingService:
    def __init__(self, model_name: str, batch_size: int):
        self.model_name = model_name
        self.batch_size = batch_size

        self.model = TextEmbedding(
            model_name=model_name
        )

        self._dimension = None

    @property
    def dimension(self) -> int:
        if self._dimension is None:
            sample = list(self.model.embed(["dimension check"]))[0]
            self._dimension = len(sample)
        return self._dimension

    def embed_documents(self, texts: list[str]) -> np.ndarray:
        return self._embed(texts)

    def embed_query(self, query: str) -> np.ndarray:
        return self._embed([query])[0]

    def _embed(self, texts: list[str]) -> np.ndarray:
        embeddings = list(
            self.model.embed(
                texts,
                batch_size=self.batch_size
            )
        )

        return np.array(
            embeddings,
            dtype=np.float32
        )