import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ORGANIZATIONS = [
  {
    value: "SOBHA_ACADEMY",
    label: "Sobha Academy",
    emailDomain: "thesobhaacademy.com",
    prefix: "TSA",
  },
  {
    value: "SKECT",
    label: "SKECT",
    emailDomain: "skect.in",
    prefix: "SKT",
  },
  {
    value: "SOBHA_HEALTH_CARE",
    label: "Sobha Health Care",
    emailDomain: "skect.in",
    prefix: "SHC",
  },
];

const DEFAULT_STATUSES = [
  { value: "OPEN", label: "Open", isDefault: true, order: 1 },
  { value: "IN_PROGRESS", label: "In Progress", isDefault: false, order: 2 },
  { value: "RESOLVED", label: "Resolved", isDefault: false, order: 3 },
  { value: "CLOSED", label: "Closed", isDefault: false, order: 4 },
];

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
  } else {
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

  // Seed organization settings
  for (const org of ORGANIZATIONS) {
    const existing = await prisma.organizationSettings.findUnique({
      where: { organization: org.value },
    });

    if (existing) {
      console.log(`Organization settings already exist for ${org.label}`);
    } else {
      const settings = await prisma.organizationSettings.create({
        data: {
          organization: org.value,
          emailDomain: org.emailDomain,
          referencePrefix: org.prefix,
          description: org.label,
          isActive: true,
        },
      });

      // Create default workflow statuses for this organization
      for (const status of DEFAULT_STATUSES) {
        await prisma.workflowStatus.create({
          data: {
            organizationSettingsId: settings.id,
            statusValue: status.value,
            label: status.label,
            isDefault: status.isDefault,
            order: status.order,
          },
        });
      }

      console.log(`Organization settings created for ${org.label}`);
    }
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
