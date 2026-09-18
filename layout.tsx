import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Search Conversion Lab",
  description:
    "A Google Search workspace for Cursor pricing intent: four responsive search ads, one pricing landing page, and one activation email.",
  icons: { icon: "/brand/cursor-icon-light.png" },
};

// The workspace canvas; cursor.com/brand publishes #14120b as the dark theme colour.
export const viewport: Viewport = { themeColor: "#0d0d0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
