const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";

  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadata}`;
};

const logger = {
  info(message, meta) {
    console.log(formatMessage("info", message, meta));
  },

  warn(message, meta) {
    console.warn(formatMessage("warn", message, meta));
  },

  error(message, meta) {
    console.error(formatMessage("error", message, meta));
  },
};

export default logger;
