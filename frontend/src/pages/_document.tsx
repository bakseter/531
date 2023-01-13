import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
    return (
        <Html lang="nb">
            <Head>
                <meta name="robots" content="follow, index" />
                <meta property="og:type" content="website" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />

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
