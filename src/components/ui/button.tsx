import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "cyan" | "primary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    let baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    let variantStyles = "";
    switch (variant) {
      case "primary":
      case "cyan": // Alias for backward compatibility
        variantStyles =
          "bg-app-primary text-white hover:bg-app-primary-hover shadow-sm";
        break;
      case "outline":
        variantStyles =
          "border border-app-border bg-transparent hover:bg-app-bg text-app-text";
        break;
      case "ghost":
        variantStyles = "hover:bg-app-bg text-app-text-muted hover:text-app-text";
        break;
      default:
        variantStyles = "bg-app-surface hover:bg-app-bg text-app-text border border-app-border";
        break;
    }

    let sizeStyles = "";
    switch (size) {
      case "sm":
        sizeStyles = "h-9 rounded-lg px-3 text-xs";
        break;
      case "lg":
        sizeStyles = "h-11 rounded-xl px-8";
        break;
      case "icon":
        sizeStyles = "h-10 w-10";
        break;
      default:
        sizeStyles = "h-10 px-4 py-2";
        break;
    }

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
