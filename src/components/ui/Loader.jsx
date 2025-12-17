import React from "react";
import { cn } from "../../utils/cn";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function Loader({
  className,
  size = "md",
  label = "Loading",
  showLabel = false,
}) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "animate-spin rounded-full border-b-transparent border-primary",
          sizeClasses[size] || sizeClasses.md
        )}
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

