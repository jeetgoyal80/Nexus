import { type ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { loggedOut, sessionRestoreFailed, sessionRestored } from "@/features/auth/store/auth-slice";
import { setApiAccessToken } from "@/shared/lib/axios";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { accessToken, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setApiAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (status !== "restoring") return;

    getCurrentUser()
      .then(({ user }) => dispatch(sessionRestored(user)))
      .catch(() => dispatch(sessionRestoreFailed()));
  }, [dispatch, status]);

  useEffect(() => {
    const onExpired = () => {
      dispatch(loggedOut());
      queryClient.clear();
    };

    window.addEventListener("nexus:auth-expired", onExpired);
    return () => window.removeEventListener("nexus:auth-expired", onExpired);
  }, [dispatch, queryClient]);

  return children;
}
