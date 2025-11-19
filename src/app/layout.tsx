import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/header";
import { Container } from "@/components/shared/container";
import { Footer } from "@/components/shared/footer";
import { OrderStatusChecker } from "@/components/shared/order-status-checker";
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from '@next/third-parties/google'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: {
    default: "FPVmaster — інструменти та обладнання для FPV",
    template: "%s | FPVmaster",
  },
  description:
    "FPVmaster — інтернет-магазин інструментів, запчастин та обладнання для FPV-дронів. Великий вибір, доступні ціни, швидка доставка по Україні.",
  keywords: [
    "FPV",
    "дрон",
    "аксесуари для FPV-дронів",
    "FPV обладнання",
    "купити FPV інструменти",
    "FPV магазин Україна",
    "FPV запчастини",
  ],
  authors: [{ name: "FPVmaster" }],
  metadataBase: new URL("https://fpvmaster.com"),

  openGraph: {
    type: "website",
    url: "https://fpvmaster.com",
    title: "FPVmaster — інструменти та обладнання для FPV",
    description:
      "FPVmaster — спеціалізований інтернет-магазин для FPV-пілотів. Інструменти, аксесуари, запчастини та комплектуючі для FPV-дронів.",
    siteName: "FPVmaster",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FPVmaster — інструменти та обладнання для FPV-дронів",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FPVmaster — інструменти та обладнання для FPV",
    description:
      "FPVmaster — інтернет-магазин з усім необхідним для FPV-дронів: інструменти, комплектуючі, аксесуари.",
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
        <OrderStatusChecker />
        <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
          <Header />
          <main className="flex-1">
            <Container className="py-10">{children}</Container>
          </main>
          <Footer />
        </div>
        <Toaster />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID ?? ''} />
      </body>
    </html>
  );
}
