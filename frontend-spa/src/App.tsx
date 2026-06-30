import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/app/providers/app-providers";
import { tokenStorage } from "@/features/auth/services/token-storage";

const Landing = routeComponent(() => import("@/routes/index"));
const Login = routeComponent(() => import("@/routes/login"));
const Signup = routeComponent(() => import("@/routes/signup"));
const Dashboard = routeComponent(() => import("@/routes/dashboard"));
const Agents = routeComponent(() => import("@/routes/agents.index"));
const NewAgent = routeComponent(() => import("@/routes/agents.new"));
const AgentBuilder = routeComponent(() => import("@/routes/agents.$agentId"));
const Knowledge = routeComponent(() => import("@/routes/knowledge"));
const Conversations = routeComponent(() => import("@/routes/conversations"));
const Analytics = routeComponent(() => import("@/routes/analytics"));
const Deployment = routeComponent(() => import("@/routes/deployment"));
const Sdk = routeComponent(() => import("@/routes/sdk"));
const Runtime = routeComponent(() => import("@/routes/runtime"));
const Settings = routeComponent(() => import("@/routes/settings"));
const Docs = routeComponent(() => import("@/routes/docs"));
const Pricing = routeComponent(() => import("@/routes/pricing"));
const Onboarding = routeComponent(() => import("@/routes/onboarding"));
const AuthCallback = routeComponent(() => import("@/routes/auth.callback"));
const PublicBot = routeComponent(() => import("@/routes/bot.$botId"));

type RouteModule = {
  Route: {
    options: {
      component?: ComponentType;
    };
  };
};

function routeComponent(loader: () => Promise<RouteModule>) {
  return lazy(async () => {
    const mod = await loader();
    const Component = mod.Route.options.component;

    if (!Component) {
      throw new Error("Route module is missing a component export.");
    }

    return { default: Component };
  });
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  return tokenStorage.getAccessToken() ? children : <Navigate to="/login" replace />;
}

function RedirectAuthenticated({ children }: { children: React.ReactNode }) {
  return tokenStorage.getAccessToken() ? <Navigate to="/dashboard" replace /> : children;
}

function PageLoader() {
  return (
    <div className="dark grid min-h-screen place-items-center bg-background text-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-gradient">
          Route not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist in this workspace.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<RedirectAuthenticated><Login /></RedirectAuthenticated>} />
          <Route path="/signup" element={<RedirectAuthenticated><Signup /></RedirectAuthenticated>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/bot/:botId" element={<PublicBot />} />

          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/agents" element={<RequireAuth><Agents /></RequireAuth>} />
          <Route path="/agents/new" element={<RequireAuth><NewAgent /></RequireAuth>} />
          <Route path="/agents/:agentId" element={<RequireAuth><AgentBuilder /></RequireAuth>} />
          <Route path="/knowledge" element={<RequireAuth><Knowledge /></RequireAuth>} />
          <Route path="/conversations" element={<RequireAuth><Conversations /></RequireAuth>} />
          <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="/deployment" element={<RequireAuth><Deployment /></RequireAuth>} />
          <Route path="/sdk" element={<RequireAuth><Sdk /></RequireAuth>} />
          <Route path="/runtime" element={<RequireAuth><Runtime /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster theme="dark" position="top-right" />
    </AppProviders>
  );
}