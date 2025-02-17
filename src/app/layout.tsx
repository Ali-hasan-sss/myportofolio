import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../../context/them_contest";

export const metadata: Metadata = {
  title: "ALI HASAN site",
  description: "معرض اعمال علي حسن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
