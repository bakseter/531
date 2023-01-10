import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            /* eslint-disable @typescript-eslint/require-await */
            // @ts-expect-error
            async authorize(credentials) {
                /* eslint-enable @typescript-eslint/require-await */
                const username = process.env.NEXTAUTH_USERNAME;
                const password = process.env.NEXTAUTH_PASSWORD;

                if (!username || !password) return null;
                if (credentials?.username !== username || credentials.password !== password) return null;

                return { name: 'default' };
            },
        }),
    ],
};

export default NextAuth(authOptions);
