import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { BaseWeightsProvider } from '@hooks/use-base-weights';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <>
            <SessionProvider session={session}>
                <BaseWeightsProvider>
                    <ChakraProvider>
                        <Component {...pageProps} />
                    </ChakraProvider>
                </BaseWeightsProvider>
            </SessionProvider>
            <Analytics />
        </>
    );
};

export default App;
