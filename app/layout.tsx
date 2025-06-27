import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Bagel_Fat_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ClientNavigationLinks } from "@/components/ClientNavigationLinks";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bagelFatOne = Bagel_Fat_One({
  variable: "--font-bagel-fat-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAG vs CAG",
  description: "RAG vs CAG",
};

function Header() {
  return (
    <header className="border-b border-gray-200 mb-0">
      <nav className="flex items-center justify-center pt-4">
        <div className="flex items-center space-x-8">
          <NavigationLinks />
        </div>
      </nav>
    </header>
  );
}

function NavigationLinks() {
  return (
    <>
      <ClientNavigationLinks />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bagelFatOne.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <div className="flex flex-col min-h-screen max-w-screen-2xl mx-auto p-4">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
