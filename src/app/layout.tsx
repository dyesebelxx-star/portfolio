import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Portfolio — AI内容创作者作品集",
    template: "%s | AI Portfolio",
  },
  description:
    "AI内容创作者作品集网站。展示AI生成图片、AI生成视频、AI Prompt工程、AI短剧与恋综项目。探索人工智能创意边界。",
  keywords: [
    "AI",
    "AI内容创作",
    "AI作品集",
    "AI视频",
    "AI图片",
    "Prompt工程",
    "AI短剧",
    "恋综",
  ],
  authors: [{ name: "AI Creator" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "AI Portfolio",
    title: "AI Portfolio — AI内容创作者作品集",
    description: "展示AI生成图片、AI视频、Prompt工程、AI短剧与恋综项目",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
