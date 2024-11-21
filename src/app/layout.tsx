import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${archivo.className} ${inter.className}`}>
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
