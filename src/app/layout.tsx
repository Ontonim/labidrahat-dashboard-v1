import type React from "react";
import "./globals.css";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={lato.variable}>
      <body>
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
