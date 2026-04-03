import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-card",
        className
      )}
      {...props}
    />
  );
}
