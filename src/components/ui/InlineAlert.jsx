import React from "react";
import Icon from "../AppIcon";
import { cn } from "../../utils/cn";

const styles = {
  info: {
    box: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "Info",
  },
  success: {
    box: "bg-green-50 border-green-200 text-green-900",
    icon: "CheckCircle",
  },
  warning: {
    box: "bg-yellow-50 border-yellow-200 text-yellow-900",
    icon: "AlertTriangle",
  },
  error: {
    box: "bg-red-50 border-red-200 text-red-900",
    icon: "AlertCircle",
  },
};

export default function InlineAlert({
  variant = "info",
  title,
  children,
  className,
}) {
  const style = styles[variant] || styles.info;

  return (
    <div
      className={cn("border rounded-lg p-3 flex items-start gap-3", style.box, className)}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon name={style.icon} size={18} className="mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        {title ? <div className="text-sm font-medium">{title}</div> : null}
        {children ? <div className="text-sm opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}

