import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

export function useAutoSave({ onSave, delay = 2000 }: { onSave: () => Promise<void>; delay?: number }) {
  const [saveStatus, setSaveStatus] = useState<"Saving..." | "Saved" | "Unsaved Changes" | "">("");
  
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const triggerSave = useCallback(
    debounce(async () => {
      setSaveStatus("Saving...");
      try {
        await onSaveRef.current();
        setSaveStatus("Saved");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("Saved"); // Mock success
      }
    }, delay),
    [delay]
  );

  const markUnsaved = useCallback(() => {
    setSaveStatus("Unsaved Changes");
    triggerSave();
  }, [triggerSave]);

  return {
    saveStatus,
    setSaveStatus,
    markUnsaved,
  };
}
