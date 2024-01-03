import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const isProd = (process.env.VERCEL_ENV ?? 'development') === 'production';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';
const testEmail = 'test@mctest.com';
const testName = 'Test McTest';

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    session: {
        maxAge: 3600,
    },
    providers: [
        process.env.VERCEL_ENV === 'production'
            ? Google
            : Credentials({
                  name: 'Credentials',
                  credentials: {
                      username: {
                          label: 'Username',
                          type: 'text',
                          placeholder: 'test',
                      },
                      password: { label: 'Password', type: 'password' },
                  },
                  // eslint-disable-next-line @typescript-eslint/require-await
                  async authorize() {
                      return {
                          id: '1',
                          name: testName,
                          email: testEmail,
                          image: 'https://i.pravatar.cc/150?u=jsmith@example.com',
                      };
                  },
              }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (!isProd) {
                try {
                    const response = await fetch(`${BACKEND_URL}/token/${encodeURIComponent(testEmail)}`);
                    const testToken = await response.text();

                    token.idToken = testToken;
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            } else if (account) {
                token.idToken = account.id_token;
            }

            return token;
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async session({ session, token }) {
            const { idToken } = token;

            if (typeof idToken === 'string') session.idToken = idToken;
            // eslint-disable-next-line no-console
            else console.log(`no idToken: ${JSON.stringify(token)}`);

            return session;
        },
    },
});
