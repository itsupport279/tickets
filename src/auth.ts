import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Used to run a bcrypt comparison even when the username doesn't exist, so
// login response time doesn't leak whether a username is valid.
const DUMMY_PASSWORD_HASH =
  "$2b$10$5taI81PuSuisowCTbwLlkuIeEcohxEb.EJ0Yse4krzZkrlcNSkx06";

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
      authorize: async (credentials) => {
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

        return { id: admin.id, name: admin.name ?? admin.username, email: undefined };
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => !!auth,
  },
});
