import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none focus:border-secondary",
        className
      )}
      {...props}
    />
  );
}
