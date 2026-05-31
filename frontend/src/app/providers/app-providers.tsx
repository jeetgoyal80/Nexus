import { type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient } from "@tanstack/react-query";
import { store } from "@/app/store/store";
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
      <QueryProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
