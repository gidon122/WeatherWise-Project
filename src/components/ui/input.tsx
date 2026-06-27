import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text placeholder-app-text-muted outline-none transition-all focus:border-app-primary disabled:cursor-not-allowed disabled:opacity-50`}
      style={{
        boxShadow: 'var(--app-shadow)'
      }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
