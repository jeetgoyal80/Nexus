import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/auth-slice";

const uiSlice = createSlice({
  name: "ui",
  initialState: { commandMenuOpen: false },
  reducers: {
    commandMenuToggled(state) {
      state.commandMenuOpen = !state.commandMenuOpen;
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiSlice.reducer,
  },
});

export const { commandMenuToggled } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
