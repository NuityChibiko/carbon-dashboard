import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast

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
        <Toaster
          position="top-right" // Position toast notifications
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#333", // Default background
              color: "#fff", // Default text color
              fontSize: "14px",
              padding: "10px 15px",
            },
            success: {
              duration: 3000, // Customize duration for success notifications
            },
            error: {
              duration: 5000, // Customize duration for error notifications
            },
          }}
        />
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
