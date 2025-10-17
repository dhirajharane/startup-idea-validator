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

          const { email, password, loginToken } = credentials;

          const user = await User.findOne({ email }).select(
            "+password +loginToken +loginTokenExpires"
          );

          if (!user || !user.isVerified) {
            console.log("User not found or not verified");
            return null;
          }

          if (password) {
            const isPasswordMatch = await user.comparePassword(password);
            if (isPasswordMatch) {
              return user;
            } else {
              console.log("Password mismatch");
            }
          }

          if (loginToken) {
            if (user.loginToken === loginToken && new Date() < user.loginTokenExpires) {
              user.loginToken = undefined;
              user.loginTokenExpires = undefined;
              await user.save();
              return user;
            } else {
              console.log("Login token invalid or expired");
            }
          }

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
