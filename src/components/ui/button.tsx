import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "cyan" | "primary";
  size?: "default" | "sm" | "lg" | "icon";
}

const getVariantStyles = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "primary":
    case "cyan": // Alias for backward compatibility
      return "bg-app-primary text-white hover:bg-app-primary-hover shadow-sm";
    case "outline":
      return "border border-app-border bg-transparent hover:bg-app-bg text-app-text";
    case "ghost":
      return "hover:bg-app-bg text-app-text-muted hover:text-app-text";
    default:
      return "bg-app-surface hover:bg-app-bg text-app-text border border-app-border";
  }
};

const getSizeStyles = (size: ButtonProps["size"]) => {
  switch (size) {
    case "sm":
      return "h-9 rounded-lg px-3 text-xs";
    case "lg":
      return "h-11 rounded-xl px-8";
    case "icon":
      return "h-10 w-10";
    default:
      return "h-10 px-4 py-2";
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const hasWhitespace = className.includes("whitespace-");
    const baseStyles =
      `inline-flex items-center justify-center ${hasWhitespace ? "" : "whitespace-nowrap"} rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]`;

    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);

    return (
      <button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
