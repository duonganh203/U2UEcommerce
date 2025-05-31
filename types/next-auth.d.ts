import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
         role: string;
         firstName: string;
         lastName: string;
      } & DefaultSession["user"];
   }

   interface User {
      role: string;
      firstName: string;
      lastName: string;
   }
}

declare module "next-auth/jwt" {
   interface JWT {
      role: string;
      firstName: string;
      lastName: string;
   }
}
