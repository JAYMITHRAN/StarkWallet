import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

interface FilterDrawerProps {
  filters: {
    type?: string;
    category?: string;
    from?: string;
    to?: string;
    sort?: string;
  };
  onChange: (next: FilterDrawerProps["filters"]) => void;
}

export function FilterDrawer({ filters, onChange }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} className="gap-2">
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Filters
      </Button>
      <Dialog open={open} onOpenChange={setOpen} title="Filters" description="Narrow transactions by type, category, and date range">
        <div className="space-y-4">
          <FormField label="Type" htmlFor="transaction-type">
            <select id="transaction-type" className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text" value={filters.type ?? ""} onChange={(event) => onChange({ ...filters, type: event.target.value })}>
              <option value="">All transactions</option>
              <option value="CASH_IN">Cash In</option>
              <option value="CASH_OUT">Cash Out</option>
            </select>
          </FormField>
          <FormField label="Category" htmlFor="transaction-category">
            <select id="transaction-category" className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text" value={filters.category ?? ""} onChange={(event) => onChange({ ...filters, category: event.target.value })}>
              <option value="">All categories</option>
              <option value="FOOD">Food</option>
              <option value="TRANSPORT">Transport</option>
              <option value="SHOPPING">Shopping</option>
              <option value="BILLS">Bills</option>
              <option value="RENT">Rent</option>
              <option value="HEALTH">Healthcare</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="EDUCATION">Education</option>
              <option value="TRAVEL">Travel</option>
              <option value="INVESTMENT">Investment</option>
              <option value="GIFT">Gift</option>
              <option value="OTHER">Others</option>
            </select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="From" htmlFor="from-date">
              <Input id="from-date" type="date" value={filters.from ?? ""} onChange={(event) => onChange({ ...filters, from: event.target.value })} />
            </FormField>
            <FormField label="To" htmlFor="to-date">
              <Input id="to-date" type="date" value={filters.to ?? ""} onChange={(event) => onChange({ ...filters, to: event.target.value })} />
            </FormField>
          </div>
          <FormField label="Sort" htmlFor="sort-order">
            <select id="sort-order" className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text" value={filters.sort ?? "newest"} onChange={(event) => onChange({ ...filters, sort: event.target.value })}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
              <option value="category">Category</option>
            </select>
          </FormField>
        </div>
      </Dialog>
    </>
  );
}
