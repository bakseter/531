import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) throw new Error('Google client id or secret is not defined');

export const authOptions: NextAuthOptions = {
    session: {
        maxAge: 3600,
    },
    providers: [GoogleProvider({ clientId, clientSecret })],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/require-await
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async session({ session, token }) {
            const { idToken } = token;

            if (typeof idToken === 'string') session.idToken = idToken;

            return session;
        },
    },
};

export default NextAuth(authOptions);
