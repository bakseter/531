import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { BaseWeightsProvider } from '@hooks/use-base-weights';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <BaseWeightsProvider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </BaseWeightsProvider>
    );
};

export default App;
