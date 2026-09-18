import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "cyan";
}

const getBadgeVariantStyles = (variant: BadgeProps["variant"]) => {
  switch (variant) {
    case "secondary":
      return "border-transparent bg-app-bg text-app-text hover:bg-app-accent/25";
    case "outline":
      return "text-app-text-muted border-app-border";
    case "cyan": // Remapped to Accent/Secondary Warm Orange
      return "border-transparent bg-app-accent/50 text-app-primary border border-app-primary/10";
    default:
      return "border-transparent bg-app-primary text-white hover:bg-app-primary-hover";
  }
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantStyles = getBadgeVariantStyles(variant);

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
  );
}
