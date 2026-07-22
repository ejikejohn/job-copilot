import { DefaultSession } from "next-auth";

// This file extends NextAuth's built-in types so TypeScript knows
// our session.user object also has an `id` field, which we added
// ourselves in the jwt/session callbacks in src/lib/auth.ts.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
