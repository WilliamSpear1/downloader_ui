import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SpinnerProps } from "@/types/spinner_props";

/** Renders an accessible, animated loading icon. */
const Spinner = ({ className, ...props }: React.ComponentProps<"svg">) => {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
};

/** Renders a full-screen loading overlay when a request is in progress. */
const SpinnerCustom = ({ isLoading }: SpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Spinner className="size-6" />
      </div>
    </div>
  );
};

export { SpinnerCustom };
