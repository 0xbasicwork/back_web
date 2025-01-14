import { drunkenFont } from './fonts'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'We\'re So Back | $BACK',
  description: 'IT\'S SEND EVERYTHING SEASON.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={drunkenFont.variable}>
      <body className={`min-h-screen ${robotoMono.className}`}>{children}</body>
    </html>
  );
}
