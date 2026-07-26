import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/transactions/SearchBar";
import { FilterDrawer } from "@/components/transactions/FilterDrawer";
import { TransactionTimeline } from "@/components/transactions/TransactionTimeline";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import { DeleteConfirmationDialog } from "@/components/transactions/DeleteConfirmationDialog";
import { UndoSnackbar } from "@/components/transactions/UndoSnackbar";
import { transactionService } from "@/services/transactionService";
import { useToast } from "@/components/ui/Toast";
export function HistoryPage() {
    const queryClient = useQueryClient();
    const { show } = useToast();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ type: "", category: "", from: "", to: "", sort: "newest" });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [undoOpen, setUndoOpen] = useState(false);
    const [lastDeletedId, setLastDeletedId] = useState(null);
    const queryKey = ["transactions", search, filters.type, filters.category, filters.from, filters.to, filters.sort];
    const { data, isLoading } = useQuery({
        queryKey,
        queryFn: () => transactionService.list({
            search,
            type: filters.type,
            category: filters.category,
            from: filters.from,
            to: filters.to,
            sort: filters.sort,
        }),
    });
    // ── Edit ─────────────────────────────────────────────────────────────
    const editMutation = useMutation({
        mutationFn: ({ id, values }) => transactionService.update(id, values),
        onSuccess: async () => {
            // Invalidate ALL transaction queries regardless of search/filter params
            await queryClient.invalidateQueries({ queryKey: ["transactions"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["summary"], exact: false });
            setSelectedTransaction(null);
            show({ tone: "success", title: "Transaction updated", description: "History has been refreshed." });
        },
        onError: (err) => {
            show({ tone: "danger", title: "Update failed", description: err?.message ?? "Something went wrong." });
        },
    });
    // ── Delete ────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: (id) => transactionService.destroy(id),
        // Optimistic update: immediately remove from the cache so the UI
        // updates instantly without waiting for the server round-trip.
        onMutate: async (id) => {
            // Cancel any in-flight refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["transactions"], exact: false });
            // Snapshot all current transaction cache entries
            const snapshots = [];
            queryClient
                .getQueriesData({ queryKey: ["transactions"] })
                .forEach(([key, txList]) => {
                if (txList)
                    snapshots.push({ key: key, data: txList });
                // Remove the transaction optimistically
                queryClient.setQueryData(key, (old) => (old ?? []).filter((tx) => tx.id !== id));
            });
            // Close the dialog immediately
            setDeleteTarget(null);
            return { snapshots };
        },
        onSuccess: async (_data, id) => {
            // Settle the cache properly and invalidate so the next refetch is clean
            await queryClient.invalidateQueries({ queryKey: ["transactions"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["summary"], exact: false });
            setLastDeletedId(id);
            setUndoOpen(true);
            show({ tone: "info", title: "Transaction deleted", description: "Tap Undo to restore it." });
        },
        onError: (err, _id, context) => {
            // Roll back the optimistic update on failure
            if (context?.snapshots) {
                context.snapshots.forEach(({ key, data }) => {
                    queryClient.setQueryData(key, data);
                });
            }
            show({ tone: "danger", title: "Delete failed", description: err?.message ?? "Something went wrong. Please try again." });
        },
    });
    // ── Restore (Undo) ────────────────────────────────────────────────────
    const restoreMutation = useMutation({
        mutationFn: (id) => transactionService.restore(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["transactions"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
            await queryClient.invalidateQueries({ queryKey: ["summary"], exact: false });
            setUndoOpen(false);
            show({ tone: "success", title: "Transaction restored", description: "History has been updated." });
        },
        onError: (err) => {
            setUndoOpen(false);
            show({ tone: "danger", title: "Restore failed", description: err?.message ?? "Something went wrong." });
        },
    });
    const transactions = useMemo(() => data ?? [], [data]);
    return (_jsxs(PageContainer, { children: [_jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-text", children: "History" }), _jsx("p", { className: "text-sm text-text-muted", children: "Search, filter and manage every transaction" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(FilterDrawer, { filters: filters, onChange: setFilters }) })] }), _jsx("div", { className: "mb-4 flex flex-col gap-3 md:flex-row", children: _jsx(SearchBar, { value: search, onChange: setSearch }) }), _jsx(Card, { className: "p-4", children: isLoading ? (_jsx("div", { className: "rounded-2xl border border-border/80 p-6 text-center text-sm text-text-muted", children: "Loading transactions\u2026" })) : !transactions.length ? (_jsx(EmptyState, { icon: History, title: "No transactions found", description: "Adjust your search and filters to see more results." })) : (_jsx(TransactionTimeline, { transactions: transactions, onEdit: (tx) => setSelectedTransaction(tx), onDelete: (tx) => setDeleteTarget(tx) })) }), _jsx(EditTransactionModal, { transaction: selectedTransaction, open: Boolean(selectedTransaction), onOpenChange: (open) => !open && setSelectedTransaction(null), onSubmit: (values) => selectedTransaction && editMutation.mutate({ id: selectedTransaction.id, values }), isSubmitting: editMutation.isPending }), _jsx(DeleteConfirmationDialog, { open: Boolean(deleteTarget), onOpenChange: (open) => {
                    // Only allow closing if no pending mutation
                    if (!open && !deleteMutation.isPending)
                        setDeleteTarget(null);
                }, onConfirm: () => {
                    if (deleteTarget && !deleteMutation.isPending) {
                        deleteMutation.mutate(deleteTarget.id);
                    }
                }, isLoading: deleteMutation.isPending }), _jsx(UndoSnackbar, { open: undoOpen, onUndo: () => lastDeletedId && restoreMutation.mutate(lastDeletedId), onDismiss: () => setUndoOpen(false) })] }));
}
