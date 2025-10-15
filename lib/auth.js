import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/user.model";
import dbConnect from "@/lib/config/database";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await dbConnect();
        let user = await User.findOne({ email: profile.email });
        if (!user) {
          user = await new User({
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            isVerified: true, 
          }).save();
        }
        return { id: user._id, name: user.fullName, email: user.email };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await dbConnect();
        const { email, password, loginToken } = credentials;

        const user = await User.findOne({ email }).select("+password +loginToken +loginTokenExpires");

        if (!user || !user.isVerified) {
          return null;
        }

        if (password) {
          const isPasswordMatch = await user.comparePassword(password);
          if (isPasswordMatch) {
            return user;
          }
        }

        if (loginToken) {
          if (user.loginToken === loginToken && new Date() < user.loginTokenExpires) {
            user.loginToken = undefined;
            user.loginTokenExpires = undefined;
            await user.save();
            return user;
          }
        }

        return null;
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
