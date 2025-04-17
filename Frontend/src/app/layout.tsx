"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from 'next/navigation';
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuth = pathname === '/register' || pathname === '/login';

  return (
    <html lang="en" className="dark">
      <body>
        <UserProvider>
          {!isAuth && (
            <>
              <div className="w-full flex flex-col bg-white">
                <Navbar />
              </div>
            </>
          )}

          <SidebarProvider >
          {children}
          </SidebarProvider>
          <Toaster />
          {!isAuth && <Footer />}
        </UserProvider>
      </body>
    </html>
  );
}

