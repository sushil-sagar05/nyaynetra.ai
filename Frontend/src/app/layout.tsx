"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from 'next/navigation';
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from 'next-themes';
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = pathname === '/register' || pathname === '/login' || pathname.match(/^\/settings\/[^/]+\/account-delete$/);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {!isAuth && <Navbar />}
            <Separator/>
            <SidebarProvider>
              {children}
            </SidebarProvider>
            <Toaster />
            <Separator/>
            {!isAuth && <Footer />}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


