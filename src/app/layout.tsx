import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../../components/theme-provider";
import Nav from "@/components/ui/Nav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Government Scheme Guidance Platform | Find Your Eligibility Easily",
  description: "Quickly discover verified government schemes you're eligible for. Use our intuitive Eligibility Checker, AI-powered chatbot, and multilingual support to confidently access the benefits you deserve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
                  <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
         
                <Nav/>
                
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
