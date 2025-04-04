import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../../context/them_contest";
import NavBar from "@/components/header/navbar";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

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
        <ThemeProvider>
          <Toaster richColors position="top-center" />
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
