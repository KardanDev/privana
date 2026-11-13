"use client";

import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { Textarea } from "@privana/ui/components/textarea";
import { cn } from "@privana/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/input-group relative flex min-h-11 w-full min-w-0 items-center rounded-xl border border-input bg-card outline-none transition-[border-color,box-shadow]",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background",
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control]:disabled]:bg-muted has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive",
        className
      )}
      data-slot="input-group"
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto select-none items-center justify-center gap-2 py-1 font-medium text-muted-foreground text-sm [&>svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      align: "inline-start",
    },
    variants: {
      align: {
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "inline-end": "order-last pr-1",
        "inline-start": "order-first pl-1",
      },
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("flex items-center gap-2 shadow-none", {
  defaultVariants: {
    size: "xs",
  },
  variants: {
    size: {
      "icon-sm": "size-11 rounded-full p-0 sm:size-8",
      "icon-xs": "size-11 rounded-full p-0 sm:size-7",
      sm: "min-h-11 gap-1 px-3 sm:min-h-8",
      xs: "min-h-11 gap-1 px-2 sm:min-h-8 [&>svg:not([class*='size-'])]:size-3.5",
    },
  },
});

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      className={cn(inputGroupButtonVariants({ size }), className)}
      data-size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-muted-foreground text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-transparent aria-invalid:ring-0",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-transparent aria-invalid:ring-0",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
