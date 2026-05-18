const writeEvent = (res, event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const sseService = {
  init(res) {
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();
  },

  sendToken(res, token) {
    writeEvent(res, "token", { token });
  },

  sendMetadata(res, data) {
    writeEvent(res, "metadata", data);
  },

  sendDone(res, data) {
    writeEvent(res, "done", data);
  },

  sendError(res, error) {
    writeEvent(res, "error", {
      message: error.message || "Streaming response failed",
    });
  },

  startHeartbeat(res) {
    return setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 15000);
  },

  close(res) {
    if (!res.writableEnded) {
      res.end();
    }
  },
};
