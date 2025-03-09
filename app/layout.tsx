'use client'

// import type { Metadata } from "next";
import "./globals.css";
import {HeroUIProvider, ToastProvider} from "@heroui/react";
import MyNavbar from "@/components/layouts/MyNavbar";
import {SessionProvider} from "next-auth/react";

// export const metadata: Metadata = {
//   title: "Sistem Manajemen Work Order",
//   description: "Sistem Manajemen Work Order untuk Manufactur",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>Sistem Manajemen Work Order</title>
      <body
        className={``}
      >
        <SessionProvider>
            <HeroUIProvider>
                <ToastProvider placement="top-right" />
                <MyNavbar />
                {children}
            </HeroUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
