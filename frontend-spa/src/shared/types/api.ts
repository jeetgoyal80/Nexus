export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorPayload = {
  success?: false;
  message?: string;
  errors?: Record<string, string[]>;
};
