import type { Metadata } from "next";
import { Winky_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
