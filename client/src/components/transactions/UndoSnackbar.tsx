import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface UndoSnackbarProps {
  open: boolean;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoSnackbar({ open, onUndo, onDismiss }: UndoSnackbarProps) {
  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => onDismiss(), 4000);
    return () => window.clearTimeout(timeout);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-glow">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text">Transaction deleted</span>
        <Button variant="primary" size="sm" onClick={onUndo}>
          Undo
        </Button>
      </div>
    </div>
  );
}
