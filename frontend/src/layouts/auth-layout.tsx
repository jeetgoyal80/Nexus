import { type ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export function AuthLayout({ children }: { children: ReactNode }) {
  const features = ["Groq Runtime", "RAG Indexing", "Public Bots"];

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="
            absolute inset-0 opacity-20
            bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)]
            bg-[size:80px_80px]
          "
        />

        {/* Orb 1 */}
        <div
          className="
            absolute
            -left-40
            -top-20
            h-[700px]
            w-[700px]
            rounded-full
            bg-blue-500/10
            blur-[140px]
            animate-float-slow
          "
        />

        {/* Orb 2 */}
        <div
          className="
            absolute
            right-[-200px]
            bottom-[-150px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-violet-500/10
            blur-[140px]
            animate-float-reverse
          "
        />

        {/* Orb 3 */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-500/5
            blur-[120px]
            animate-pulse-slow
          "
        />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1fr_560px]">
        {/* LEFT PANEL */}
        <section
          className="
            relative hidden
            border-r border-border/40
            bg-white/[0.02]
            backdrop-blur-3xl
            p-12
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >
          {/* Top */}
          <div>
            <Logo />
          </div>

          {/* Center */}
          <div className="max-w-2xl">
            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-border/50
                bg-card/40
                px-4
                py-2
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                text-muted-foreground
                backdrop-blur-xl
              "
            >
              AI Runtime Infrastructure
            </div>

            <h1
              className="
                mt-8
                text-7xl
                font-bold
                tracking-[-0.05em]
                leading-[0.95]
              "
            >
              Build.
              <br />
              Deploy.
              <br />
              Scale AI.
            </h1>

            <p
              className="
                mt-8
                max-w-xl
                text-lg
                leading-8
                text-muted-foreground
              "
            >
              Operate agents, retrieval systems, AI workflows, runtime infrastructure, and public
              chatbots from one unified control plane.
            </p>

            {/* Status Card */}
            <div
              className="
                mt-10
                rounded-3xl
                border
                border-border/50
                bg-card/40
                p-5
                backdrop-blur-xl
              "
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>

                <span className="font-medium">Runtime Infrastructure Online</span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Agents</span>
                  <span className="text-foreground">247 Active</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Knowledge Base</span>
                  <span className="text-foreground">Healthy</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Inference</span>
                  <span className="text-foreground">Operational</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="
                    rounded-2xl
                    border
                    border-border/50
                    bg-card/40
                    p-4
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  <span
                    className="
                      mb-3
                      block
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_20px_rgba(74,222,128,0.8)]
                    "
                  />

                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Nexus Cloud Workspace</p>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground">All Systems Operational</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <main className="flex items-center justify-center p-6 md:p-10">
          <div className="relative w-full max-w-md">
            {/* Spotlight Glow */}
            <div
              className="
                absolute
                inset-0
                rounded-[40px]
                bg-gradient-to-r
                from-blue-500/20
                via-violet-500/20
                to-cyan-500/20
                blur-3xl
              "
            />

            <div className="relative">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
