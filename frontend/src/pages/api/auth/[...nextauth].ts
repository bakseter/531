import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) throw new Error('Google client id or secret is not defined');

const isProd = (process.env.VERCEL_ENV ?? 'production') === 'production';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';
const testEmail = 'test@mctest.com';
const testName = 'Test McTest';

export const authOptions: NextAuthOptions = {
    session: {
        maxAge: 3600,
    },
    providers: [
        process.env.VERCEL_ENV === 'production'
            ? GoogleProvider({ clientId, clientSecret })
            : CredentialsProvider({
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
                    const response = await fetch(`${BACKEND_URL}/token${testEmail}`);
                    const testToken = await response.text();

                    token.idToken = testToken;
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                    throw new Error(JSON.stringify(error));
                }
            } else if (account) {
                token.idToken = account.id_token;
            }

            return token;
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async session({ session, token }) {
            const { idToken } = token;

            if (!isProd) {
                try {
                    const response = await fetch(`${BACKEND_URL}/token/${testEmail}`);
                    const testToken = await response.text();

                    session.idToken = testToken;
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            } else if (typeof idToken === 'string') {
                session.idToken = idToken;
            }

            return session;
        },
    },
};

export default NextAuth(authOptions);
