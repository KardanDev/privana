import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@privana/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex max-w-full shrink-0 select-none items-center justify-center rounded-xl border border-transparent bg-clip-padding text-center font-medium text-base leading-5 outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "min-h-11 gap-2 px-[18px] py-2.5",
        icon: "size-11 rounded-full sm:size-9",
        "icon-lg": "size-12 rounded-full",
        "icon-sm": "size-11 rounded-full sm:size-8",
        "icon-xs":
          "size-11 rounded-full sm:size-7 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 gap-2 px-6 py-3",
        sm: "min-h-11 gap-1.5 px-4 py-2.5 sm:min-h-9 sm:py-1.5",
        xs: "min-h-11 gap-1 px-3 py-2.5 sm:min-h-8 sm:py-1 [&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border-input bg-card hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      },
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
