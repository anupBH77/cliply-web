import React from "react";
import { Check, Loader2 } from "lucide-react";

interface SaveStatusProps {
  status: "Saving..." | "Saved" | "Unsaved Changes" | "";
}

export default function SaveStatus({ status }: SaveStatusProps) {
  if (!status) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
      {status === "Saving..." && (
        <>
          <Loader2 size={12} className="animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "Saved" && (
        <>
          <Check size={12} />
          <span>Saved</span>
        </>
      )}
      {status === "Unsaved Changes" && (
        <span>Unsaved Changes</span>
      )}
    </div>
  );
}
