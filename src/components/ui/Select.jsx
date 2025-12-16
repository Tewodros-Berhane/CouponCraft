import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = React.forwardRef(
  (
    {
      className,
      options = [],
      value,
      defaultValue,
      placeholder = "Select an option",
      multiple = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      clearable = false,
      loading = false,
      id,
      name,
      onChange,
      searchable,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId.replace(/:/g, "")}`;
    const helpId = `${selectId}-help`;
    const errorId = `${selectId}-error`;
    const describedBy = error ? errorId : description ? helpId : undefined;

    if (searchable && import.meta?.env?.DEV) {
      // Not implemented in this Radix-backed select; reserved for a future Combobox.
      // eslint-disable-next-line no-console
      console.warn("Select searchable=true is not supported yet.");
    }

    if (multiple) {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className={cn("space-y-2", className)}>
          {label && (
            <label
              htmlFor={selectId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error ? "text-destructive" : "text-foreground"
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}

          <select
            ref={ref}
            id={selectId}
            name={name}
            multiple
            disabled={disabled || loading}
            required={required}
            value={selected}
            onChange={(e) => {
              const next = Array.from(e.target.selectedOptions).map((o) => o.value);
              onChange?.(next);
            }}
            className={cn(
              "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive"
            )}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          >
            {options?.map((option) => (
              <option key={option?.value} value={option?.value} disabled={option?.disabled}>
                {option?.label}
              </option>
            ))}
          </select>

          {description && !error && (
            <p id={helpId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
          {error && (
            <p id={errorId} className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      );
    }

    const hasValue = value !== undefined && value !== null && value !== "";
    const resolvedValue = value ?? defaultValue ?? "";

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <SelectPrimitive.Root
            value={resolvedValue}
            onValueChange={(next) => onChange?.(next)}
            disabled={disabled || loading}
          >
            <SelectPrimitive.Trigger
              ref={ref}
              id={selectId}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-destructive focus:ring-destructive",
                clearable && hasValue && "pr-16"
              )}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              {...props}
            >
              <SelectPrimitive.Value placeholder={placeholder} />
              <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                className="z-50 overflow-hidden rounded-md border border-border bg-white text-black shadow-level-3"
                position="popper"
                sideOffset={6}
              >
                <SelectPrimitive.Viewport className="p-1">
                  {options?.map((option) => (
                    <SelectPrimitive.Item
                      key={option?.value}
                      value={option?.value}
                      disabled={option?.disabled}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      )}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <SelectPrimitive.ItemIndicator>
                          <Check className="h-4 w-4" />
                        </SelectPrimitive.ItemIndicator>
                      </span>
                      <div className="flex-1 min-w-0">
                        <SelectPrimitive.ItemText>
                          <span className="truncate">{option?.label}</span>
                        </SelectPrimitive.ItemText>
                        {option?.description ? (
                          <div className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </div>
                        ) : null}
                      </div>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>

          {name ? (
            <input type="hidden" name={name} value={resolvedValue} />
          ) : null}

          {clearable && hasValue && !(disabled || loading) ? (
            <button
              type="button"
              className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded p-1"
              aria-label="Clear selection"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange?.("");
              }}
            >
              ×
            </button>
          ) : null}
        </div>

        {description && !error && (
          <p id={helpId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

