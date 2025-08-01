import type { Metadata } from "next";
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
      <meta name="viewport" content="height=device-height, initial-scale=1, minimum-scale=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
      <body>
        {children}
      </body>
    </html>
  );
}
