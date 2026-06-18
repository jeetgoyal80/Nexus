import { type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient } from "@tanstack/react-query";
import { persistor, store } from "@/app/store/store";
import { env } from "@/shared/lib/env";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient?: QueryClient;
}) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              {env.googleClientId ? (
                <GoogleOAuthProvider clientId={env.googleClientId}>{children}</GoogleOAuthProvider>
              ) : (
                children
              )}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
