import Head from 'next/head'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import '../styles/index.css';
import '@fontsource/geist-mono';
import '@fontsource/geist-sans';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Notetxt</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Notetxt" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://notetxt.iinter.me/external/og.png" />
        <meta name="twitter:image" content="https://notetxt.iinter.me/external/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#161617" />
        <meta property="og:description" content="A note-taker app with a focus on minimalism and simplicity, so you can write down what's on your mind." />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico"></link>
      </Head>
      <div className="selection:bg-neutral-700 selection:text-zinc-300">
        <Component {...pageProps} />
      </div>
      <Analytics />
    </>
  )
}

export default MyApp