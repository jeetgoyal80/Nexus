export type User = {
  id: string;
  name: string;
  email: string;
  provider: "local" | "google";
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};
