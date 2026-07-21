# ─────────────────────────────────────────────────────────────────────────────
# revert-theme.ps1 — One-click rollback to the original Stark Glass theme
# Run from the project root: .\revert-theme.ps1
# ─────────────────────────────────────────────────────────────────────────────

$root = $PSScriptRoot

Write-Host ""
Write-Host "Reverting to Stark Glass theme..." -ForegroundColor Cyan
Write-Host ""

Copy-Item "$root\client\src\styles\globals.backup.css" "$root\client\src\styles\globals.css" -Force
Write-Host "  Restored: globals.css" -ForegroundColor Green

Copy-Item "$root\client\tailwind.config.backup.ts" "$root\client\tailwind.config.ts" -Force
Write-Host "  Restored: tailwind.config.ts" -ForegroundColor Green

Copy-Item "$root\client\src\components\layout\Sidebar.backup.tsx" "$root\client\src\components\layout\Sidebar.tsx" -Force
Write-Host "  Restored: Sidebar.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\components\layout\TopNavigation.backup.tsx" "$root\client\src\components\layout\TopNavigation.tsx" -Force
Write-Host "  Restored: TopNavigation.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\layouts\ProtectedLayout.backup.tsx" "$root\client\src\layouts\ProtectedLayout.tsx" -Force
Write-Host "  Restored: ProtectedLayout.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\components\ui\Card.backup.tsx" "$root\client\src\components\ui\Card.tsx" -Force
Write-Host "  Restored: Card.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\components\ui\Button.backup.tsx" "$root\client\src\components\ui\Button.tsx" -Force
Write-Host "  Restored: Button.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\components\ui\DashboardCard.backup.tsx" "$root\client\src\components\ui\DashboardCard.tsx" -Force
Write-Host "  Restored: DashboardCard.tsx" -ForegroundColor Green

Copy-Item "$root\client\src\components\ui\Input.backup.tsx" "$root\client\src\components\ui\Input.tsx" -Force
Write-Host "  Restored: Input.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "Done! Vite will hot-reload automatically." -ForegroundColor Cyan
Write-Host ""
