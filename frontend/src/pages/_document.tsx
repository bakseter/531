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

                <link rel="apple-touch-icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
                <link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48x48.png" />
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
