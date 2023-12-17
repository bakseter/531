import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import Credentials from '@auth/sveltekit/providers/credentials';
import {
  GOOGLE_CLIENT_ID as clientId,
  GOOGLE_CLIENT_SECRET as clientSecret
} from '$env/static/private';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { dev } from '$app/environment';

const email = 'test@test.com';

const handle = SvelteKitAuth({
  session: {
    maxAge: 3600
  },
  providers: [
    dev
      ? Credentials({
          name: 'Credentials',
          credentials: {
            username: {
              label: 'Username',
              type: 'text',
              placeholder: 'test'
            },
            password: { label: 'Password', type: 'password' }
          },
          async authorize() {
            return {
              id: '1',
              name: 'Test User',
              email,
              image: 'https://i.pravatar.cc/150?u=jsmith@example.com'
            };
          }
        })
      : Google({
          clientId,
          clientSecret
        })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (dev) {
        try {
          const response = await fetch(`${PUBLIC_BACKEND_URL}/token/${encodeURIComponent(email)}`);
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
    }
  }
});

export { handle };
