import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { orbitron } from "@/lib/fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "3D Island — Piezas 3D únicas fabricadas en Canarias",
    template: "%s | 3D Island",
  },
  description:
    "Tienda de impresión 3D premium fabricada a mano en Fuerteventura, Canarias. Gaming, TCG, accesorios y piezas personalizadas bajo demanda.",
  keywords: [
    "impresión 3D",
    "piezas 3D",
    "gaming",
    "TCG",
    "Canarias",
    "Fuerteventura",
    "personalizado",
    "accesorios",
    "3D Island",
  ],
  authors: [{ name: "3D Island", url: "https://3disland.es" }],
  creator: "3D Island",
  publisher: "3D Island",
  metadataBase: new URL("https://3disland.es"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://3disland.es",
    siteName: "3D Island",
    title: "3D Island — Piezas 3D únicas fabricadas en Canarias",
    description:
      "Tienda de impresión 3D premium fabricada a mano en Fuerteventura, Canarias. Gaming, TCG, accesorios y piezas personalizadas bajo demanda.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "3D Island — Piezas 3D únicas fabricadas en Canarias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Island — Piezas 3D únicas fabricadas en Canarias",
    description:
      "Tienda de impresión 3D premium fabricada a mano en Fuerteventura, Canarias.",
    images: ["/og-image.png"],
    creator: "@3disland",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

const htmlClassName = [
  geistSans.variable,
  geistMono.variable,
  orbitron.variable,
  inter.variable,
  "h-full antialiased",
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={htmlClassName}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col [color-scheme:dark]"
        style={{ color: "#E9D5FF" }}
      >
        <div suppressHydrationWarning className="flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}