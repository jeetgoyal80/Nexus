# Streaming Chat API

The streaming endpoint uses Server-Sent Event formatting over a `POST` request:

```http
POST /api/chat/stream/:botId
Content-Type: application/json
Accept: text/event-stream
Authorization: Bearer <access_token>
```

Request body:

```json
{
  "message": "Explain Redis caching",
  "sessionId": "browser-session-id"
}
```

Because this endpoint is `POST` and supports authorization headers, use `fetch` with a readable stream in browser clients instead of the native `EventSource` API.

```js
export async function streamChat({
  apiBaseUrl,
  botId,
  accessToken,
  message,
  sessionId,
  onMetadata,
  onToken,
  onDone,
  onError,
}) {
  const response = await fetch(`${apiBaseUrl}/api/chat/stream/${botId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Streaming request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder();
  let buffer = "";

  const handleEvent = (block) => {
    let event = "message";
    const dataLines = [];

    for (const rawLine of block.split("\n")) {
      const line = rawLine.trimEnd();

      if (!line || line.startsWith(":")) continue;
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    }

    if (!dataLines.length) return;

    const data = JSON.parse(dataLines.join("\n"));

    if (event === "metadata") onMetadata?.(data);
    if (event === "token") onToken?.(data.token);
    if (event === "done") onDone?.(data);
    if (event === "error") onError?.(data);
  };

  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";

    for (const block of blocks) {
      handleEvent(block);
    }
  }

  if (buffer.trim()) {
    handleEvent(buffer);
  }
}
```

Expected events:

```text
event: metadata
data: {"conversationId":"...","sessionId":"...","contextCount":0}

event: token
data: {"token":"Hello"}

event: done
data: {"conversationId":"...","sessionId":"...","provider":"groq","model":"llama-3.1-8b-instant"}
```
