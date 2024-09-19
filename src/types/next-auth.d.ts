import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    payload: {
      sub: string;
      name: string;
      type: number;
      rememberMe: boolean;
      iat: number;
      exp: number;
    };
    token: {
      user: {
        id: string; // Ajuste conforme o tipo real do seu id
        name: string;
        type: number;
        rememberMe: boolean;
      };
    };
  }
}
