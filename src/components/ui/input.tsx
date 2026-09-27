import * as React from "react";

import { cn } from "../../lib/utils";

// Shared look for text inputs, textareas and native selects.
export const fieldClasses =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input type={type} className={cn(fieldClasses, "h-11", className)} ref={ref} {...props} />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(fieldClasses, "min-h-[120px] resize-y", className)} ref={ref} {...props} />
  ),
);
Textarea.displayName = "Textarea";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label className={cn("text-sm font-medium leading-none text-foreground", className)} ref={ref} {...props} />
  ),
);
Label.displayName = "Label";

export { Input, Textarea, Label };
