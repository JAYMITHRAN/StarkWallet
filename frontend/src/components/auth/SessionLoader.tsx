import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function SessionLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-panel w-full max-w-sm p-6 text-center">
        <LoadingSpinner label="Checking authentication..." size="lg" />
      </div>
    </div>
  );
}
