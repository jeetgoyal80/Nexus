import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/shared/router/react-router-compat";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/store/hooks";
import { persistor } from "@/app/store/store";
import { loggedOut, sessionStarted } from "../store/auth-slice";
import { setApiAccessToken } from "@/shared/lib/axios";
import { login } from "../api/login";
import { signup } from "../api/signup";
import { googleLogin } from "../api/google-login";
import { logout } from "../api/logout";

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSession = (session: Awaited<ReturnType<typeof login>>) => {
    setApiAccessToken(session.accessToken);
    dispatch(sessionStarted(session));
  };

  const clearClientSession = async () => {
    setApiAccessToken(null);
    dispatch(loggedOut());
    queryClient.clear();
    await persistor.purge();
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
    }),
    logout: useMutation({
      mutationFn: logout,
      onMutate: async () => {
        await clearClientSession();
        await navigate({ to: "/login", replace: true });
      },
      onSuccess: () => {
        toast.success("Signed out");
      },
      onError: () => {
        toast.warning("Signed out locally. Server session could not be confirmed.");
      },
    }),
  };
}
