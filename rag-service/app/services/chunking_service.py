import re
from dataclasses import dataclass


@dataclass
class TextChunk:
    text: str
    chunk_index: int
    metadata: dict


class ChunkingService:
    def __init__(self, chunk_size_tokens: int, chunk_overlap_tokens: int):
        self.chunk_size_tokens = chunk_size_tokens
        self.chunk_overlap_tokens = chunk_overlap_tokens

    def chunk_text(self, text: str, bot_id: str, source: str) -> list[TextChunk]:
        sections = self._split_into_semantic_sections(text)
        chunks: list[TextChunk] = []
        current_tokens: list[str] = []

        for section in sections:
            section_tokens = section.split()

            if len(section_tokens) > self.chunk_size_tokens:
                self._flush_chunk(chunks, current_tokens, bot_id, source)
                current_tokens = []
                chunks.extend(self._split_large_section(section_tokens, bot_id, source, len(chunks)))
                continue

            if len(current_tokens) + len(section_tokens) > self.chunk_size_tokens:
                self._flush_chunk(chunks, current_tokens, bot_id, source)
                current_tokens = current_tokens[-self.chunk_overlap_tokens :] if self.chunk_overlap_tokens else []

            current_tokens.extend(section_tokens)

        self._flush_chunk(chunks, current_tokens, bot_id, source)
        return chunks

    def _split_into_semantic_sections(self, text: str) -> list[str]:
        raw_sections = re.split(r"\n\s*\n", text)
        sections: list[str] = []

        for section in raw_sections:
            cleaned = section.strip()
            if not cleaned:
                continue

            if self._looks_like_heading(cleaned) and sections:
                sections[-1] = f"{sections[-1]}\n\n{cleaned}"
            else:
                sections.append(cleaned)

        return sections

    def _looks_like_heading(self, text: str) -> bool:
        words = text.split()
        return len(words) <= 12 and (text.isupper() or not text.endswith("."))

    def _split_large_section(
        self,
        tokens: list[str],
        bot_id: str,
        source: str,
        start_index: int,
    ) -> list[TextChunk]:
        chunks: list[TextChunk] = []
        step = max(1, self.chunk_size_tokens - self.chunk_overlap_tokens)

        for offset in range(0, len(tokens), step):
            window = tokens[offset : offset + self.chunk_size_tokens]
            if not window:
                continue

            chunks.append(
                TextChunk(
                    text=" ".join(window),
                    chunk_index=start_index + len(chunks),
                    metadata={
                        "botId": bot_id,
                        "source": source,
                        "chunkIndex": start_index + len(chunks),
                    },
                )
            )

        return chunks

    def _flush_chunk(
        self,
        chunks: list[TextChunk],
        tokens: list[str],
        bot_id: str,
        source: str,
    ) -> None:
        if not tokens:
            return

        chunk_index = len(chunks)
        chunks.append(
            TextChunk(
                text=" ".join(tokens),
                chunk_index=chunk_index,
                metadata={
                    "botId": bot_id,
                    "source": source,
                    "chunkIndex": chunk_index,
                },
            )
        )
