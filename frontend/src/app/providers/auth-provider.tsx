import { type ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import {
  accessTokenRefreshed,
  loggedOut,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionRestored,
} from "@/features/auth/store/auth-slice";
import { setApiAccessToken } from "@/shared/lib/axios";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { accessToken, status, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setApiAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || status === "anonymous") return;

    if (status !== "restoring") {
      dispatch(sessionRestoreStarted());
    }

    getCurrentUser()
      .then(({ user }) => dispatch(sessionRestored(user)))
      .catch(() => dispatch(sessionRestoreFailed()));
  }, [accessToken, dispatch]);

  useEffect(() => {
    const onExpired = () => {
      dispatch(loggedOut());
      queryClient.clear();
    };

    const onTokenRefreshed = (event: Event) => {
      const token = (event as CustomEvent<string>).detail;
      if (token) {
        dispatch(accessTokenRefreshed(token));
      }
    };

    window.addEventListener("nexus:auth-expired", onExpired);
    window.addEventListener("nexus:token-refreshed", onTokenRefreshed);

    return () => {
      window.removeEventListener("nexus:auth-expired", onExpired);
      window.removeEventListener("nexus:token-refreshed", onTokenRefreshed);
    };
  }, [dispatch, queryClient]);

  if (status === "restoring" && !user) {
    return null;
  }

  return children;
}
