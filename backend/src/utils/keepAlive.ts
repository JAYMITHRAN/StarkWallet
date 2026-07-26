/**
 * keepAlive.ts
 *
 * Prevents Render's free-tier web service from spinning down due to inactivity.
 * Render spins down services after ~15 minutes of no traffic on the free plan.
 *
 * Strategy: ping our own /health endpoint every 14 minutes. Render
 * automatically injects RENDER_EXTERNAL_URL with the public HTTPS URL.
 *
 * Only runs in production — in development this is a no-op.
 */

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export function startKeepAlive(): void {
  if (process.env["NODE_ENV"] !== "production") return;

  const selfUrl = process.env["RENDER_EXTERNAL_URL"];
  if (!selfUrl) {
    console.warn(
      "[keep-alive] RENDER_EXTERNAL_URL is not set — keep-alive disabled. " +
        "Render injects this automatically on deployed services."
    );
    return;
  }

  const pingUrl = `${selfUrl}/health`;
  console.info(`[keep-alive] Self-ping active → ${pingUrl} every 14 min`);

  setInterval(async () => {
    try {
      const res = await fetch(pingUrl, { method: "GET" });
      if (res.ok) {
        console.info(`[keep-alive] ✓ Ping OK — ${new Date().toISOString()}`);
      } else {
        console.warn(`[keep-alive] ✗ Ping returned status ${res.status}`);
      }
    } catch (err) {
      // Network errors are non-fatal; just log and continue
      console.warn("[keep-alive] ✗ Ping failed:", (err as Error).message);
    }
  }, PING_INTERVAL_MS);
}
