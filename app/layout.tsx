import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const robotoMono = localFont({
  src: './fonts/RobotoMono-Bold.ttf',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: "We're So Back | $BACK",
  description: "IT'S SEND EVERYTHING SEASON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} bg-white`}>
        {children}
      </body>
    </html>
  );
}
