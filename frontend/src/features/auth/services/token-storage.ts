const ACCESS_TOKEN_KEY = "nexus.accessToken";
const PERSISTED_AUTH_KEY = "persist:auth";

const parsePersistedAuthToken = (rawState: string | null) => {
  if (!rawState) return null;

  try {
    const persistedState = JSON.parse(rawState) as { accessToken?: string };
    const persistedToken = persistedState.accessToken;

    if (!persistedToken) return null;

    return JSON.parse(persistedToken) as string | null;
  } catch {
    return null;
  }
};

export const tokenStorage = {
  getAccessToken() {
    if (typeof window === "undefined") return null;
    return (
      window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
      parsePersistedAuthToken(window.localStorage.getItem(PERSISTED_AUTH_KEY))
    );
  },
  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearAccessToken() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
