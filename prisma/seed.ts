import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME ?? "Administrator";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: { passwordHash, name },
    create: { username, passwordHash, name },
  });

  console.log(`Admin account ready: username="${admin.username}"`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Using default password "${password}" — change it after first login / set SEED_ADMIN_PASSWORD.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
