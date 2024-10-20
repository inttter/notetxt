import localFont from 'next/font/local'

export const geistSans = localFont({
  src: [
    {
      path: '../fonts/GeistVF.woff',
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const jetbrainsMono = localFont({
  src: [
    {
      path: '../fonts/JetBrainsMonoVF.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const iaWriterQuattro = localFont({
  src: [
    {
      path: '../fonts/iAWriterQuattroVF.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: '--font-ia-quattro',
  display: 'swap',
})