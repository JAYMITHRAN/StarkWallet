interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 12) score += 1;

  if (score <= 2) return { label: "Weak", tone: "danger", width: "33%" };
  if (score <= 4) return { label: "Fair", tone: "warning", width: "66%" };
  return { label: "Strong", tone: "success", width: "100%" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getStrength(password);
  const toneClass = {
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  }[strength.tone];

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Password strength</span>
        <span className="font-medium text-text">{strength.label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full transition-all ${toneClass}`} style={{ width: strength.width }} />
      </div>
    </div>
  );
}
