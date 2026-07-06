import { cn } from "../../lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-3 sm:py-2",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
