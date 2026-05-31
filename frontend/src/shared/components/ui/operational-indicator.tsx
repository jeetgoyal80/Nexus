import { cn } from "@/lib/utils";

export function OperationalIndicator({
  state = "healthy",
  label,
}: {
  state?: "healthy" | "degraded" | "processing" | "offline";
  label: string;
}) {
  const colors = {
    healthy: "bg-emerald-400 text-emerald-300 shadow-[0_0_10px_oklch(0.78_0.15_160)]",
    degraded: "bg-amber-400 text-amber-300 shadow-[0_0_10px_oklch(0.82_0.16_80)]",
    processing: "bg-blue-400 text-blue-300 shadow-[0_0_10px_oklch(0.72_0.16_255)]",
    offline: "bg-zinc-500 text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        colors[state].split(" ").slice(1).join(" "),
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          colors[state].split(" ")[0],
          colors[state].split(" ").slice(2).join(" "),
        )}
      />
      {label}
    </span>
  );
}
