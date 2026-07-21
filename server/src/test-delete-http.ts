import { buildApp } from "./app.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  const app = await buildApp();
  await app.ready();

  const user = await prisma.user.findFirst();
  if (!user) { console.error("No user found"); return; }

  const token = app.jwt.sign({ userId: user.id });

  const tx = await prisma.transaction.findFirst({ where: { userId: user.id, isDeleted: false } });
  if (!tx) { console.error("No transaction found"); return; }

  console.log(`\nTesting DELETE WITH Content-Type: application/json header (as browser sends)`);
  console.log(`Transaction: ${tx.id}`);

  const res = await app.inject({
    method: "DELETE",
    url: `/api/v1/transactions/${tx.id}`,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",   // exactly what the browser was sending
    },
  });

  console.log("Status:", res.statusCode);
  console.log("Body:", res.body.slice(0, 200));

  if (res.statusCode === 200) {
    await prisma.transaction.update({ where: { id: tx.id }, data: { isDeleted: false, deletedAt: null } });
    console.log("Restored.");
  }

  await app.close();
}
main().catch(console.error);
