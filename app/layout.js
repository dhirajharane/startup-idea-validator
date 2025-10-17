import { Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "StartUpInspector",
  description: "An AI-powered tool to generate comprehensive startup reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}