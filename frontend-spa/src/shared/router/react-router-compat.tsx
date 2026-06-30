import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate as useRouterNavigate,
  useParams,
} from "react-router-dom";
import type { ComponentProps, ComponentType, ReactNode } from "react";

type Params = Record<string, string | number | undefined>;
type LinkProps = Omit<ComponentProps<typeof RouterLink>, "to"> & {
  to: string;
  params?: Params;
};

type RouteOptions = {
  beforeLoad?: () => void;
  component?: ComponentType;
  head?: () => unknown;
};

function interpolatePath(to: string, params?: Params) {
  if (!params) return to;

  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`$${key}`, encodeURIComponent(String(value ?? ""))),
    to,
  );
}

export function Link({ to, params, ...props }: LinkProps) {
  return <RouterLink to={interpolatePath(to, params)} {...props} />;
}

export function useNavigate() {
  const navigate = useRouterNavigate();

  return ({
    to,
    params,
    replace,
  }: {
    to: string;
    params?: Params;
    replace?: boolean;
  }) => navigate(interpolatePath(to, params), { replace });
}

export function useRouterState<T>({
  select,
}: {
  select: (state: { location: ReturnType<typeof useLocation> }) => T;
}) {
  const location = useLocation();
  return select({ location });
}

export function redirect({ to }: { to: string }) {
  throw new Response(null, { status: 302, headers: { Location: to } });
}

export function createFileRoute(_path: string) {
  return (options: RouteOptions) => ({
    options,
    useParams,
  });
}

export { Outlet };
export type { ReactNode };
