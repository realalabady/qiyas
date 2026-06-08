import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface AppFrameProps extends PropsWithChildren {
  maxWidthClassName?: string;
  className?: string;
  showBackdrop?: boolean;
}

function AppFrame({
  children,
  maxWidthClassName = "max-w-6xl",
  className,
  showBackdrop = true,
}: AppFrameProps) {
  return (
    <div className="relative min-h-screen">
      {showBackdrop ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(34,211,238,0.12),transparent_35%)]" />
      ) : null}
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full flex-col px-4 sm:px-6",
          maxWidthClassName,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default AppFrame;
