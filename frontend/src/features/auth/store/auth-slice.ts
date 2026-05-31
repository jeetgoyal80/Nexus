import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "../services/token-storage";
import type { User } from "../types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "restoring" | "authenticated" | "anonymous";
};

const initialState: AuthState = {
  user: null,
  accessToken: tokenStorage.getAccessToken(),
  status: tokenStorage.getAccessToken() ? "restoring" : "anonymous",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionStarted(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
      tokenStorage.setAccessToken(action.payload.accessToken);
    },
    accessTokenRefreshed(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      tokenStorage.setAccessToken(action.payload);
    },
    sessionRestored(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    sessionRestoreFailed(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "anonymous";
      tokenStorage.clearAccessToken();
    },
    loggedOut(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "anonymous";
      tokenStorage.clearAccessToken();
    },
  },
});

export const {
  sessionStarted,
  accessTokenRefreshed,
  sessionRestored,
  sessionRestoreFailed,
  loggedOut,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
