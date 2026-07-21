import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, isLoading = false }: DeleteConfirmationDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete transaction"
      description="This will soft-delete the transaction and keep it available for recovery within the current session."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      isDestructive
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
