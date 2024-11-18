"use-client";
import "./styles/globals.css";
import { Archivo } from "next/font/google";
import Header from "../app/components/Header";

const archivo = Archivo({
  subsets: ["latin"], // เลือก subset ตามความต้องการ
  weight: ["400", "700"], // เลือกน้ำหนักของฟอนต์
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={archivo.className}>
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
