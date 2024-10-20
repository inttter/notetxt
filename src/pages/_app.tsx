import React from 'react';
import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';
import '@/styles/index.css';
import '@/styles/github-alerts.css';
import 'github-markdown-css';
import { TextProvider } from '../components/markdown/TextContent';
import { geistSans, jetbrainsMono, iaWriterQuattro } from '../styles/fonts';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Notetxt</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style jsx global>{`
        :root {
          --font-geist-sans: ${geistSans.style.fontFamily};
          --font-jetbrains-mono: ${jetbrainsMono.style.fontFamily};
          --font-ia-quattro: ${iaWriterQuattro.style.fontFamily};
        }
      `}</style>
      <TextProvider>
        <div className={`${geistSans.variable} ${jetbrainsMono.variable} ${iaWriterQuattro.variable} font-sans antialiased selection:bg-neutral-700 selection:text-zinc-300`}>
          <Component {...pageProps} />
        </div>
      </TextProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;