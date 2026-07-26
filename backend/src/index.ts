import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { startKeepAlive } from "./utils/keepAlive.js";

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 StarkMoneyWalletTracker API ready on http://${env.HOST}:${env.PORT}`);

    // Keep Render free-tier alive by self-pinging /health every 14 minutes.
    startKeepAlive();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();

