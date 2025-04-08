"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from 'next/navigation';
import { UserProvider } from "@/context/UserContext";

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
        {/* Only render the Navbar and Footer if the page is not the login or register page */}
        <UserProvider>
          {!isAuth && (
            <>
              <div className="w-full flex flex-col bg-white">
                <Navbar />
              </div>
            </>
          )}

          {/* Main content */}
          {children}

          {/* Toaster Notifications */}
          <Toaster />

          {/* Footer only shown for non-auth pages */}
          {!isAuth && <Footer />}
        </UserProvider>
      </body>
    </html>
  );
}

