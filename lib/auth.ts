import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import connectDB from "@/src/lib/db";
import { User } from "@/src/models/User";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
   adapter: MongoDBAdapter(clientPromise),
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               return null;
            }

            try {
               await connectDB();

               const user = await User.findOne({ email: credentials.email });

               if (!user) {
                  return null;
               }

               const isPasswordValid = await user.comparePassword(
                  credentials.password
               );

               if (!isPasswordValid) {
                  return null;
               }

               return {
                  id: (user._id as any).toString(),
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  role: user.role,
               };
            } catch (error) {
               console.error("Authentication error:", error);
               return null;
            }
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.firstName = user.firstName;
            token.lastName = user.lastName;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.sub!;
            session.user.role = token.role as string;
            session.user.firstName = token.firstName as string;
            session.user.lastName = token.lastName as string;
         }
         return session;
      },
   },
   pages: {
      signIn: "/login",
   },
   secret: process.env.NEXTAUTH_SECRET,
};
