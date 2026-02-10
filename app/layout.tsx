import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // ⬅️ ajouter ça

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dayz Building Name",
  description: "Learn DayZ building names with flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script
          async
          src="https://cloud.umami.is/script.js" // ⬅️ colle l’URL donnée par Umami
          data-website-id="a9fedbb3-60b5-4331-bc15-eb8999306848" // ⬅️ colle l’ID de ton site
        />
        {children}
      </body>
    </html>
  );
}
