import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/header";
import { Container } from "@/components/shared/container";
import { Footer } from "@/components/shared/footer";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});


export const metadata: Metadata = {
  title: {
    default: "FPV Master UA",
    template: "%s | Назва вашого магазину",
  },
  description: "Короткий опис інтернет-магазину для SEO.",
  keywords: ["купити", "інтернет-магазин", "товари", "бренд"],
  authors: [{ name: "FPV Master UA" }],
  metadataBase: new URL("https://fpvmaster.com.ua"),

  openGraph: {
    type: "website",
    url: "https://fpvmaster.com.ua",
    title: "FPV Master UA",
    description: "Короткий опис вашого магазину для соцмереж.",
    siteName: "Назва вашого магазину",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Головне превʼю сайту",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FPV Master UA",
    description: "Короткий опис для Twitter.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
          <Header />
          <main className="flex-1">
            <div className="flex min-h-screen flex-col">
              <Container className="py-10">{children}</Container>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
