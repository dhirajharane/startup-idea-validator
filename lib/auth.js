import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";

// Ensure this NextAuth route runs in Node.js runtime (required for mongoose)
export const runtime = "nodejs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          await dbConnect(); // connect to MongoDB

          const email = typeof credentials.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
          const { password } = credentials;

          const user = await User.findOne({ email }).select("+password");

          if (!user || !password) {
            console.log("User not found or password missing");
            return null;
          }

          const isPasswordMatch = await user.comparePassword(password);
          if (isPasswordMatch) {
            return user;
          }

          console.log("Password mismatch");

          return null;
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
