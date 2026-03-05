import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/i18n/ThemeContext";

export const metadata: Metadata = {
  title: "Open Purchase - Restaurant Procurement",
  description: "Open source restaurant procurement management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
