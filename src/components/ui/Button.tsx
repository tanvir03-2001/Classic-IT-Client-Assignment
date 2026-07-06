import { cn } from "../../lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-primary text-primary-foreground hover:bg-blue-700": variant === "default",
            "border border-border bg-white hover:bg-secondary": variant === "outline",
            "bg-destructive text-white hover:bg-red-600": variant === "destructive",
            "hover:bg-secondary": variant === "ghost",
            "h-7 px-2.5 text-xs sm:h-8 sm:px-3 sm:text-sm": size === "sm",
            "h-9 px-3 text-sm sm:h-10 sm:px-4": size === "md",
            "h-10 px-4 text-sm sm:h-11 sm:px-6": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
