import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-on-primary hover:bg-[#111111]",
  secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high",
  outline: "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low",
  gradient:
    "bg-gradient-to-r from-secondary to-secondary-container text-on-primary hover:opacity-95"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4",
  lg: "h-12 px-5 text-base"
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
