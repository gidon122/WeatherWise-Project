import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "cyan";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  let variantStyles = "";
  switch (variant) {
    case "secondary":
      variantStyles =
        "border-transparent bg-app-bg text-app-text hover:bg-app-accent/25";
      break;
    case "outline":
      variantStyles = "text-app-text-muted border-app-border";
      break;
    case "cyan": // Remapped to Accent/Secondary Warm Orange
      variantStyles =
        "border-transparent bg-app-accent/50 text-app-primary border border-app-primary/10";
      break;
    default:
      variantStyles =
        "border-transparent bg-app-primary text-white hover:bg-app-primary-hover";
      break;
  }

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
  );
}
