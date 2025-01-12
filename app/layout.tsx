import { Roboto_Mono } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'We\'re So Back | $BACK',
  description: 'IT\'S SEND EVERYTHING SEASON.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoMono.variable}`}>
      <body className="font-mono">{children}</body>
    </html>
  );
}
