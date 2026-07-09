import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Used to run a bcrypt comparison even when the username doesn't exist, so
// login response time doesn't leak whether a username is valid.
const DUMMY_PASSWORD_HASH =
  "$2b$10$5taI81PuSuisowCTbwLlkuIeEcohxEb.EJ0Yse4krzZkrlcNSkx06";

const LOGIN_LOG_RETENTION_DAYS = 30;

async function recordLogin(adminId: string, username: string, request: Request) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;
  const userAgent = request.headers.get("user-agent");

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOGIN_LOG_RETENTION_DAYS);

  await Promise.all([
    prisma.adminLoginLog.create({
      data: { adminId, username, ipAddress, userAgent },
    }),
    prisma.adminLoginLog.deleteMany({ where: { createdAt: { lt: cutoff } } }),
  ]);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        const admin = await prisma.admin.findUnique({ where: { username } });

        // Always run bcrypt.compare, even for an unknown username, against
        // a fixed dummy hash so both branches take comparable time.
        const valid = await bcrypt.compare(
          password,
          admin?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );
        if (!admin || !valid) return null;

        await recordLogin(admin.id, admin.username, request);

        return {
          id: admin.id,
          name: admin.name ?? admin.username,
          email: undefined,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => !!auth,
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "ADMIN";
      }
      return session;
    },
  },
});
