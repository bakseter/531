import DefaultSession from '@auth/core';

declare module '@auth/core/types' {
	interface JWT {
		idToken: string;
		accessToken: string;
	}

	interface Session extends DefaultSession {
		idToken: string;
		accessToken: string;
	}
}
