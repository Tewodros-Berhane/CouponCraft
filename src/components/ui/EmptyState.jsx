import React from "react";
import Icon from "../AppIcon";
import { cn } from "../../utils/cn";

export default function EmptyState({
  iconName = "Inbox",
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn("text-center py-12", className)}>
      <Icon name={iconName} size={48} className="mx-auto text-muted-foreground mb-4" />
      {title ? <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3> : null}
      {description ? <p className="text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

