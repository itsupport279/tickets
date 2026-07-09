import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const explicitPassword = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Administrator";

  const existing = await prisma.admin.findUnique({ where: { username } });

  if (existing) {
    const data: { name: string; role: string; passwordHash?: string } = {
      name,
      role: "SUPER_ADMIN",
    };
    if (explicitPassword) {
      data.passwordHash = await bcrypt.hash(explicitPassword, 10);
    }

    const admin = await prisma.admin.update({ where: { username }, data });
    console.log(
      `Super admin account updated: username="${admin.username}"` +
        (explicitPassword ? " (password changed)" : " (password left unchanged)"),
    );
    return;
  }

  const password = explicitPassword ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { username, passwordHash, name, role: "SUPER_ADMIN" },
  });

  console.log(`Super admin account created: username="${admin.username}"`);
  if (!explicitPassword) {
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
