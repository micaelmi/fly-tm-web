import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    payload: {
      sub: string;
      name: string;
      username: string;
      type: number;
      iat: number;
      exp: number;
    };
    token: {
      exp: number;
      iat: number;
      jti: string;
      user: {
        token: string;
      };
    };
  }
}
