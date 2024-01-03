import type { ReactNode } from 'react';
import { Open_Sans, Roboto_Mono } from 'next/font/google'; // eslint-disable-line camelcase
import type { Metadata, Viewport } from 'next';
import { auth } from '@api/auth-config';
import SessionProviderWrapper from '@components/session-provider-wrapper';
import { BaseWeightsProvider } from '@hooks/use-base-weights';
import { ProfileProvider } from '@hooks/use-profile';
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

const metadata: Metadata = {
    robots: 'follow, index',
    description: '5/3/1 Program',
    title: '5/3/1',
    openGraph: {
        type: 'website',
    },
    manifest: '/site.webmanifest',
    icons: {
        icon: '/icons/icon-48x48.png',
        apple: '/icons/icon-512x512.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black',
    },
};

const viewport: Viewport = {
    themeColor: '#ffffff',
};

interface LayoutProps {
    children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await auth();

    return (
        <html lang="nb" className={`${openSans.variable} ${robotoMono.variable}`}>
            <body className="md:container md:mx-auto">
                <SessionProviderWrapper session={session ?? undefined}>
                    <ProfileProvider>
                        <BaseWeightsProvider>{children}</BaseWeightsProvider>
                    </ProfileProvider>
                </SessionProviderWrapper>
            </body>
        </html>
    );
};

export { metadata, viewport };
export default Layout;
