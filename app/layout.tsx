import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
// import { cronJob } from "@/lib/cron";
import {
  ClerkProvider,

} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSync - AI Career Coach",
  description: "SkillSync - AI Career Coach",
};

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const res = await cronJob()
  return (
    <ClerkProvider appearance={{
      baseTheme:dark
    }}>
    <html lang="en" suppressHydrationWarning>
    <head>
    <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              
          <Header/>
           <main className="min-h-screen">
           {children}
           </main>
           <Toaster richColors />
          </ThemeProvider>
         
      </body>
      
    </html>
    </ClerkProvider>
  );
}
