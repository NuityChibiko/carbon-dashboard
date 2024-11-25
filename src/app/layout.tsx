"use client";
import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "@/styles/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${archivo.className} ${inter.className}`}>
        <Providers>
          <Header />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            theme="colored"
          />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
