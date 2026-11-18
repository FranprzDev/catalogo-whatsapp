import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo WhatsApp",
  description: "Catálogo web para tiendas de ropa que venden por WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
