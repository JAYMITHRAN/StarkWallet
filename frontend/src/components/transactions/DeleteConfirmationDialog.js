import { jsx as _jsx } from "react/jsx-runtime";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, isLoading = false }) {
    return (_jsx(ConfirmDialog, { open: open, onOpenChange: onOpenChange, title: "Delete transaction", description: "This will soft-delete the transaction and keep it available for recovery within the current session.", confirmLabel: "Delete", cancelLabel: "Cancel", isDestructive: true, isLoading: isLoading, onConfirm: onConfirm }));
}
