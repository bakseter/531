import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { Open_Sans, Roboto_Mono } from 'next/font/google'; // eslint-disable-line camelcase
import SessionProviderWrapper from '@components/session-provider-wrapper';
import { BaseWeightsProvider } from '@hooks/use-base-weights';
import { ProfileProvider } from '@hooks/use-profile';
import { authOptions } from '@api/auth-config';
import '@styles/globals.css';

const openSans = Open_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-open-sans',
});

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-mono',
});

interface LayoutProps {
    children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions);

    return (
        <html lang="nb" className={`${openSans.variable} ${robotoMono.variable}`}>
            <head>
                <meta name="robots" content="follow, index" />
                <meta name="description" content="5/3/1 Program" />
                <meta property="og:type" content="website" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="theme-color" content="#ffffff" />

                <link rel="apple-touch-icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
                <link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48x48.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body>
                <div className="md:container md:mx-auto">
                    <SessionProviderWrapper session={session ?? undefined}>
                        <ProfileProvider>
                            <BaseWeightsProvider>{children}</BaseWeightsProvider>
                        </ProfileProvider>
                    </SessionProviderWrapper>
                </div>
            </body>
        </html>
    );
};

export default Layout;
