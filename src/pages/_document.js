import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Notetxt" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://notetxt.xyz/external/og.png" />
        <meta property="og:description" content="A note-taker app with a focus on minimalism and simplicity, so you can write down what's on your mind." />
        <meta name="description" content="A note-taker app with a focus on minimalism and simplicity, so you can write down what's on your mind. Now with Markdown support!" />
        <meta name="twitter:image" content="https://notetxt.xyz/external/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#161617" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="preconnect" href="https://api.github.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}