from pydantic import BaseModel, Field


class RetrieveContextRequest(BaseModel):
    botId: str = Field(..., min_length=1)
    query: str = Field(..., min_length=1)
    topK: int = Field(default=5, ge=1, le=20)


class RetrievedContext(BaseModel):
    text: str
    score: float
    chunkIndex: int
    source: str | None = None


class RetrieveContextResponse(BaseModel):
    botId: str
    query: str
    contexts: list[str]
    matches: list[RetrievedContext]


class IngestResponse(BaseModel):
    botId: str
    source: str
    chunksCreated: int
    vectorsStored: int


class IngestUrlRequest(BaseModel):
    botId: str = Field(..., min_length=1)
    fileUrl: str = Field(..., min_length=1)
    originalName: str = Field(..., min_length=1)
    sourceId: str | None = None


class DeleteSourceRequest(BaseModel):
    botId: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1)
