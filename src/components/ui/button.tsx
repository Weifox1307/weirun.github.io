import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 transition-[background-color,box-shadow,color,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent),0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] hover:brightness-110",
        ghost:
          "bg-card/70 text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_12%,transparent)] hover:bg-card",
        outline:
          "bg-transparent text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_16%,transparent)] hover:bg-card/60",
        limeGhost:
          "bg-transparent text-primary shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] hover:bg-primary/10",
      },
      size: {
        sm: "h-10 rounded-lg px-3.5 text-sm",
        md: "h-12 rounded-xl px-5 text-sm",
        lg: "h-14 rounded-2xl px-6 text-base",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { Button, buttonVariants };
