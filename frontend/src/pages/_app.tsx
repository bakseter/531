import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { BaseWeightsProvider } from '@hooks/use-base-weights';
import { ProfileProvider } from '@hooks/use-profile';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <>
            <SessionProvider session={session}>
                <ProfileProvider>
                    <BaseWeightsProvider>
                        <ChakraProvider>
                            <Component {...pageProps} />
                        </ChakraProvider>
                    </BaseWeightsProvider>
                </ProfileProvider>
            </SessionProvider>
            <Analytics />
        </>
    );
};

export default App;
