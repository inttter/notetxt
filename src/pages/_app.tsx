import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>notetxt - Write down what's on your mind.</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Notetxt" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://notetxt.iinter.me/external/og.png" />
        <meta name="twitter:image" content="https://notetxt.iinter.me/external/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#161617" />
        <meta property="og:description" content="A simple text editor to write down what's on your mind." />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico"></link>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp