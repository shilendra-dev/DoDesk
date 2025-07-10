import React from "react";
import { Loader2 } from "lucide-react";

const SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const spinnerIcon = (
    <Loader2
      className={`animate-spin text-[var(--color-accent)] ${SIZE_MAP[size]}`}
    />
  );

  if (!fullScreen) return spinnerIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {spinnerIcon}
    </div>
  );
};

export default LoadingSpinner;