import { configureStore, createSlice } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { authReducer } from "@/features/auth/store/auth-slice";
import { persistStorage } from "./persist-storage";

const uiSlice = createSlice({
  name: "ui",
  initialState: { commandMenuOpen: false },
  reducers: {
    commandMenuToggled(state) {
      state.commandMenuOpen = !state.commandMenuOpen;
    },
  },
});

const persistedAuthReducer = persistReducer(
  {
    key: "auth",
    storage: persistStorage,
    whitelist: ["user", "accessToken", "status"],
  },
  authReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export const { commandMenuToggled } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
