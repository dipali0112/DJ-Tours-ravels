import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Outfit, Inter, Poppins } from "next/font/google";
import "../globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import FloatingChat from '@/components/FloatingChat';
import { Metadata } from 'next';

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "DJ Tour & Travels | Smart AI Travel Assistant",
    description: "AI-powered travel assistant by DJ Tour & Travels",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    // Providing all messages to the client
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${outfit.variable} ${inter.variable} ${poppins.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <ChatProvider>
                            {children}
                            <FloatingChat />
                        </ChatProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
