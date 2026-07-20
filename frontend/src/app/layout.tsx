import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "A simple Next.js app with Rails API backend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main className="mt-16 px-16 py-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
