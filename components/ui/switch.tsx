"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * shadcn's Switch (Radix underneath: keyboard, role="switch", aria-checked),
 * recoloured for the site's dark grounds — white when on, a faint white track
 * when off — with a visible focus ring.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-ui",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-[translate,background-color] duration-300 ease-ui",
        "data-[state=checked]:translate-x-5 data-[state=checked]:bg-ink data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
