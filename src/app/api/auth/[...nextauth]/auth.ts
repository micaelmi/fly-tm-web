import api from "@/lib/axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      credentials: {
        credential: { label: "credential", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await api.post("/users/login", credentials, {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status >= 200 && status < 500,
        });
        const jwt = await res.data;

        if (res.status === 200 && jwt) {
          return jwt;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 24 * 60 * 60 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      const t = JSON.stringify(token);
      const payload = jwtDecode(t);
      session = { payload, token } as any;
      return session;
    },
  },
};
