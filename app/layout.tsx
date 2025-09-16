import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import AppBar from "./components/Appbar";
import Footer from "./components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata : Metadata = {
  title: "Solana Hub",
  description: "A one-stop dApp to send, receive, and manage SOL on-chain.",
  openGraph: {
    title: "Solana Hub",
    description: "A one-stop dApp to send, receive, and manage SOL on-chain.",
    url: "https://solanahub.mishalturkane.xyz",
    siteName: "Solana Hub",
    images: [
      {
        url: "https://solanahub.mishalturkane.xyz/banner.png", 
        width: 1200,
        height: 630,
        alt: "Solana Hub Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Hub",
    description: "A one-stop dApp to send, receive, and manage SOL on-chain.",
    images: ["https://solanahub.mishalturkane.xyz/banner.png"], 
    creator: "@mishaldotrwa", 
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Providers> <AppBar/>{children} <Footer/></Providers>
      </body>
    </html>
  );
}
