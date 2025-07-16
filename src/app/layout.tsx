import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Classic To-Do List App - Dark Theme",
  description: "A timeless, aesthetically pleasing to-do list application with a dark theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <Header />
        <div className="w-full flex flex-col items-center justify-center mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-amber-400 mb-2 text-center drop-shadow-lg">Task Management Board</h1>
          <p className="text-gray-400 font-serif max-w-lg text-center">Organize your tasks using a Scrum-style board with To Do, In Progress, and Done columns.</p>
        </div>
        {children}
      </body>
    </html>
  );
}
