import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Suspense } from "react";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "E-commerce Platform",
    description: "Your one-stop e-commerce solution",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={poppins.variable} suppressHydrationWarning>
            <body className='font-sans antialiased'>
                <Suspense>
                    <ThemeProvider>
                        <AuthProvider>
                            {" "}
                            <CartProvider>
                                <div className='min-h-screen bg-background text-foreground'>
                                    <ConditionalNavbar />
                                    {children}
                                </div>
                            </CartProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </Suspense>
            </body>
        </html>
    );
}
