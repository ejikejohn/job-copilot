import { handlers } from "@/lib/auth";

// NextAuth needs to handle both GET and POST requests
// for things like sign-in pages, callbacks, and sign-out.
export const { GET, POST } = handlers;
