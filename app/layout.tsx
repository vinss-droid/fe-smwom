import type { Metadata } from "next";
import "./globals.css";
import {HeroUIProvider} from "@heroui/react";
import MyNavbar from "@/components/layouts/MyNavbar";

export const metadata: Metadata = {
  title: "Sistem Manajemen Work Order",
  description: "Sistem Manajemen Work Order untuk Manufactur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <HeroUIProvider>
            <MyNavbar />
            {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
