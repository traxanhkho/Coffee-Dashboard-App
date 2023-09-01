import _ from "lodash";
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCurrentUser } from "@/utils/getCurrentUser";


export const authOptions = {
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },

      async authorize(credentials, req) {
        try {
          const { data: jwt } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_KEY}/auth`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const currentUser = await getCurrentUser(jwt);

          currentUser.token = jwt;
          return currentUser;
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token = _.pick(user, ["_id", "name", "email", "isAdmin", "token"]);
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session = _.pick(token, ["_id", "name", "email", "isAdmin", "token"]);
      }

      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
