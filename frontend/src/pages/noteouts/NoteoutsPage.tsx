import { useMemo, useState, useEffect } from "react";
import {
  BookText,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  Undo2,
  Search,
  X,
  ChevronDown,
  Lock,
  Unlock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import { noteoutService } from "@/services/noteoutService";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Noteout, CreateNoteoutRequest, UpdateNoteoutRequest } from "@stark/shared/types/index";
import { NoteoutType } from "@stark/shared/types/index";

// ─────────────────────────────────────────────────────────────────────────
// Quick-Add Form (inline at top)
// ─────────────────────────────────────────────────────────────────────────
function NoteoutForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { show } = useToast();
  const [type, setType] = useState<NoteoutType>(NoteoutType.OUT);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteoutRequest) => noteoutService.create(payload),
    onSuccess: () => {
      setAmount("");
      setReason("");
      setNote("");
      setIsOpen(false);
      onSubmitted();
      show({ tone: "success", title: "Noteout saved", description: "Entry added to your notebook." });
    },
    onError: (err: any) => {
      show({ tone: "danger", title: "Failed to save", description: err?.message ?? "Something went wrong." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (!reason.trim()) return;
    mutation.mutate({ type, amount: parsedAmount, reason: reason.trim(), note: note.trim() || undefined });
  };

  return (
    <Card className="overflow-hidden">
      {/* Collapsed state: just a button */}
      {!isOpen ? (
        <button
          id="noteout-add-button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-3 px-1 py-1 text-left transition-colors hover:bg-white/5 rounded-xl"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15">
            <Plus className="h-5 w-5 text-purple-400" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-text">Add a new noteout</p>
            <p className="text-xs text-text-muted">Record an off-balance transaction</p>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">New Noteout Entry</h3>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-text-muted hover:text-text hover:bg-white/5">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Type Toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setType(NoteoutType.OUT)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors",
                type === NoteoutType.OUT
                  ? "bg-danger/15 text-danger"
                  : "text-text-muted hover:bg-white/5"
              )}
            >
              <ArrowUpRight className="mr-1.5 inline h-4 w-4" />
              Noted Out
            </button>
            <button
              type="button"
              onClick={() => setType(NoteoutType.IN)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors border-l border-border",
                type === NoteoutType.IN
                  ? "bg-success/15 text-success"
                  : "text-text-muted hover:bg-white/5"
              )}
            >
              <ArrowDownLeft className="mr-1.5 inline h-4 w-4" />
              Noted In
            </button>
          </div>

          {/* Amount */}
          <FormField label="Amount" htmlFor="noteout-amount">
            <Input
              id="noteout-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </FormField>

          {/* Reason (required) */}
          <FormField label="Reason" htmlFor="noteout-reason" hint="What was this for?">
            <Input
              id="noteout-reason"
              placeholder="e.g. Lent money to friend"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={200}
              required
            />
          </FormField>

          {/* Note (optional) */}
          <FormField label="Note (optional)" htmlFor="noteout-note">
            <Input
              id="noteout-note"
              placeholder="Any extra details…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={280}
            />
          </FormField>

          <Button type="submit" isLoading={mutation.isPending} className="w-full">
            Save Noteout
          </Button>
        </form>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Edit Modal
// ─────────────────────────────────────────────────────────────────────────
function EditNoteoutModal({
  noteout,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  noteout: Noteout | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UpdateNoteoutRequest) => void;
  isSubmitting: boolean;
}) {
  const [type, setType] = useState<NoteoutType>(NoteoutType.OUT);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  // Sync form with selected noteout when modal opens or target changes
  useEffect(() => {
    if (noteout) {
      setType(noteout.type as NoteoutType);
      setAmount(String(noteout.amount));
      setReason(noteout.reason);
      setNote(noteout.note ?? "");
    }
  }, [noteout]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: parseFloat(amount),
      reason: reason.trim(),
      note: note.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Edit Noteout">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setType(NoteoutType.OUT)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors",
              type === NoteoutType.OUT ? "bg-danger/15 text-danger" : "text-text-muted hover:bg-white/5"
            )}
          >
            Noted Out
          </button>
          <button
            type="button"
            onClick={() => setType(NoteoutType.IN)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors border-l border-border",
              type === NoteoutType.IN ? "bg-success/15 text-success" : "text-text-muted hover:bg-white/5"
            )}
          >
            Noted In
          </button>
        </div>

        <FormField label="Amount" htmlFor="edit-noteout-amount">
          <Input
            id="edit-noteout-amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Reason" htmlFor="edit-noteout-reason">
          <Input
            id="edit-noteout-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
            required
          />
        </FormField>

        <FormField label="Note" htmlFor="edit-noteout-note">
          <Input
            id="edit-noteout-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={280}
          />
        </FormField>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Noteout Timeline Item
// ─────────────────────────────────────────────────────────────────────────
function NoteoutItem({
  noteout,
  onEdit,
  onDelete,
}: {
  noteout: Noteout;
  onEdit: (n: Noteout) => void;
  onDelete: (n: Noteout) => void;
}) {
  const isIn = noteout.type === "IN";
  return (
    <div className="group relative flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.03]">
      {/* Direction icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isIn ? "bg-success/10" : "bg-danger/10"
        )}
      >
        {isIn ? (
          <ArrowDownLeft className="h-4 w-4 text-success" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-danger" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-text">{noteout.reason}</p>
          <span
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums",
              isIn ? "text-success" : "text-danger"
            )}
          >
            {isIn ? "+" : "−"}{formatCurrency(noteout.amount)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
          <span>{formatDate(noteout.occurredAt)}</span>
          {noteout.note && (
            <>
              <span className="text-border">·</span>
              <span className="truncate">{noteout.note}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(noteout)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-white/10 hover:text-accent"
          aria-label="Edit noteout"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(noteout)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-white/10 hover:text-danger"
          aria-label="Delete noteout"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────
export function NoteoutsPage() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "IN" | "OUT">("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Selected noteout for editing
  const [editTarget, setEditTarget] = useState<Noteout | null>(null);
  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Noteout | null>(null);
  // Undo
  const [lastDeletedId, setLastDeletedId] = useState<string | null>(null);
  const [undoOpen, setUndoOpen] = useState(false);

  // ── Password Protection State (Requires "sruthi" every time opened) ──
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [notebookPassword, setNotebookPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (notebookPassword.trim().toLowerCase() === "sruthi") {
      setIsUnlocked(true);
      setPasswordError("");
      setNotebookPassword("");
    } else {
      setPasswordError("Incorrect notebook password. Please try again.");
    }
  };

  // ── Queries ────────────────────────────────────────────────────────────
  const summaryQuery = useQuery({
    queryKey: ["noteouts-summary"],
    queryFn: () => noteoutService.summary(),
    enabled: isUnlocked,
  });

  const listQuery = useQuery({
    queryKey: ["noteouts", search, typeFilter, sortOrder],
    queryFn: () =>
      noteoutService.list({
        search: search || undefined,
        type: typeFilter || undefined,
        sort: sortOrder,
      } as any),
    enabled: isUnlocked,
  });

  const noteouts = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  const refreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ["noteouts"], exact: false });
    await queryClient.invalidateQueries({ queryKey: ["noteouts-summary"], exact: false });
  };

  // ── Edit Mutation ──────────────────────────────────────────────────────
  const editMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateNoteoutRequest }) =>
      noteoutService.update(id, values),
    onSuccess: async () => {
      await refreshAll();
      setEditTarget(null);
      show({ tone: "success", title: "Noteout updated" });
    },
    onError: (err: any) => {
      show({ tone: "danger", title: "Update failed", description: err?.message ?? "Something went wrong." });
    },
  });

  // ── Delete Mutation ────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteoutService.destroy(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["noteouts"], exact: false });
      const snapshots: Array<{ key: readonly unknown[]; data: Noteout[] }> = [];
      queryClient
        .getQueriesData<Noteout[]>({ queryKey: ["noteouts"] })
        .forEach(([key, list]) => {
          if (list) snapshots.push({ key: key as readonly unknown[], data: list });
          queryClient.setQueryData<Noteout[]>(key, (old) => (old ?? []).filter((n) => n.id !== id));
        });
      setDeleteTarget(null);
      return { snapshots };
    },
    onSuccess: async (_data, id) => {
      await refreshAll();
      setLastDeletedId(id);
      setUndoOpen(true);
      show({ tone: "info", title: "Noteout deleted", description: "Tap Undo to restore it." });
    },
    onError: (err: any, _id, context: any) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ key, data }: { key: readonly unknown[]; data: Noteout[] }) => {
          queryClient.setQueryData(key, data);
        });
      }
      show({ tone: "danger", title: "Delete failed", description: err?.message ?? "Something went wrong." });
    },
  });

  // ── Restore Mutation ───────────────────────────────────────────────────
  const restoreMutation = useMutation({
    mutationFn: (id: string) => noteoutService.restore(id),
    onSuccess: async () => {
      await refreshAll();
      setUndoOpen(false);
      show({ tone: "success", title: "Noteout restored" });
    },
    onError: (err: any) => {
      setUndoOpen(false);
      show({ tone: "danger", title: "Restore failed", description: err?.message ?? "Something went wrong." });
    },
  });

  const summary = summaryQuery.data;

  // ── Render Lock Screen if Not Unlocked ─────────────────────────────────
  if (!isUnlocked) {
    return (
      <PageContainer className="flex min-h-[70vh] flex-col items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center space-y-6 border-purple-500/30 bg-purple-500/5 shadow-glow">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
            <Lock className="h-7 w-7" aria-hidden />
          </div>

          <div>
            <h2 className="text-xl font-bold text-text">Protected Notebook</h2>
            <p className="mt-1 text-sm text-text-muted">
              Enter the notebook verification password to access your noteouts.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <FormField label="Notebook Password" htmlFor="notebook-pass">
              <Input
                id="notebook-pass"
                type="password"
                placeholder="Enter password..."
                value={notebookPassword}
                onChange={(e) => {
                  setNotebookPassword(e.target.value);
                  setPasswordError("");
                }}
                autoFocus
                required
              />
            </FormField>

            {passwordError && (
              <p className="text-xs font-medium text-danger">{passwordError}</p>
            )}

            <Button type="submit" className="w-full !bg-purple-600 hover:!bg-purple-500">
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Notebook
            </Button>
          </form>

          <Link
            to="/settings"
            className="inline-block text-xs font-medium text-text-muted hover:text-text transition-colors"
          >
            ← Back to Settings
          </Link>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <BookText className="h-5 w-5 text-purple-400" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text">Noteouts</h1>
            <p className="text-sm text-text-muted">Off-balance notebook — doesn't affect your wallet</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsUnlocked(false)}
          className="text-xs text-text-muted hover:text-purple-400"
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          Lock Notebook
        </Button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DashboardCard
            label="Total noted in"
            value={formatCurrency(summary.totalNotedIn)}
            icon={ArrowDownLeft}
            tone="success"
          />
          <DashboardCard
            label="Total noted out"
            value={formatCurrency(summary.totalNotedOut)}
            icon={ArrowUpRight}
            tone="danger"
          />
          <DashboardCard
            label="Total entries"
            value={String(summary.count)}
            icon={BookText}
            tone="accent"
          />
        </div>
      )}

      {/* Quick-Add Form */}
      <NoteoutForm onSubmitted={refreshAll} />

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="noteout-search"
            type="text"
            placeholder="Search noteouts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {/* Type filter */}
          <div className="relative">
            <select
              id="noteout-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "" | "IN" | "OUT")}
              className="h-11 appearance-none rounded-xl border border-border bg-surface pl-3 pr-8 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
            >
              <option value="">All types</option>
              <option value="IN">Noted In</option>
              <option value="OUT">Noted Out</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              id="noteout-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="h-11 appearance-none rounded-xl border border-border bg-surface pl-3 pr-8 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <Card className="p-2 sm:p-4">
        {listQuery.isLoading ? (
          <div className="rounded-2xl border border-border/80 p-6 text-center text-sm text-text-muted">
            Loading noteouts…
          </div>
        ) : !noteouts.length ? (
          <EmptyState
            icon={BookText}
            title="No noteouts yet"
            description="Your off-balance notebook is empty. Add an entry above to get started."
          />
        ) : (
          <div className="divide-y divide-border/50">
            {noteouts.map((n) => (
              <NoteoutItem
                key={n.id}
                noteout={n}
                onEdit={(item) => setEditTarget(item)}
                onDelete={(item) => setDeleteTarget(item)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <EditNoteoutModal
        noteout={editTarget}
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSubmit={(values) =>
          editTarget && editMutation.mutate({ id: editTarget.id, values })
        }
        isSubmitting={editMutation.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleteTarget(null);
        }}
        title="Delete Noteout"
        description="This entry will be removed from your notebook. You can undo this action."
      >
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            isLoading={deleteMutation.isPending}
            className="flex-1 !bg-danger hover:!bg-danger/90"
          >
            Delete
          </Button>
        </div>
      </Dialog>

      {/* Undo Snackbar */}
      {undoOpen && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
          <div className="glass-panel flex items-center gap-3 px-4 py-3 shadow-glow">
            <span className="text-sm text-text">Noteout deleted</span>
            <button
              onClick={() => lastDeletedId && restoreMutation.mutate(lastDeletedId)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-white/10 transition-colors"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </button>
            <button
              onClick={() => setUndoOpen(false)}
              className="rounded-lg p-1 text-text-muted hover:text-text hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
