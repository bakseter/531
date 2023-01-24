import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
    return (
        <Html lang="nb">
            <Head>
                <meta name="robots" content="follow, index" />
                <meta name="description" content="5/3/1 Program" />
                <meta property="og:type" content="website" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="theme-color" content="#ffffff" />

                <link rel="apple-touch-icon" sizes="180x180" href="/ios/512.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
