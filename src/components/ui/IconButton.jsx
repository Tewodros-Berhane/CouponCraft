import React from "react";
import Button from "./Button";

const IconButton = React.forwardRef(
  (
    { ariaLabel, "aria-label": ariaLabelProp, iconName, title, children, ...props },
    ref
  ) => {
    const label = ariaLabelProp || ariaLabel;

    if (!label && import.meta?.env?.DEV) {
      throw new Error("IconButton requires aria-label");
    }

    return (
      <Button
        ref={ref}
        size="icon"
        variant="ghost"
        iconName={iconName}
        aria-label={label}
        title={title || label}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;

