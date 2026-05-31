import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/store/hooks";
import { loggedOut, sessionStarted } from "../store/auth-slice";
import { setApiAccessToken } from "@/shared/lib/axios";
import { login } from "../api/login";
import { signup } from "../api/signup";
import { googleLogin } from "../api/google-login";
import { logout } from "../api/logout";

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const onSession = (session: Awaited<ReturnType<typeof login>>) => {
    setApiAccessToken(session.accessToken);
    dispatch(sessionStarted(session));
  };

  return {
    login: useMutation({
      mutationFn: login,
      onSuccess: (session) => {
        onSession(session);
        toast.success("Signed in");
      },
      onError: () => toast.error("Unable to sign in"),
    }),
    signup: useMutation({
      mutationFn: signup,
      onSuccess: (session) => {
        onSession(session);
        toast.success("Workspace created");
      },
      onError: () => toast.error("Unable to create account"),
    }),
    googleLogin: useMutation({
      mutationFn: googleLogin,
      onSuccess: onSession,
      onError: () => toast.error("Google authentication failed"),
    }),
    logout: useMutation({
      mutationFn: logout,
      onSettled: () => {
        setApiAccessToken(null);
        dispatch(loggedOut());
        queryClient.clear();
      },
    }),
  };
}
