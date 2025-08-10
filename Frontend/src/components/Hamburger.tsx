'use client'
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Upload, User, Settings, LogOut, Home, FileText, Shield, X } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'
import api from '@/lib/api'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';

function Hamburger() {
  const { user, setUser } = useUser()
  const [open, setOpen] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  const handleBtnClick = (route: string) => {
    router.push(route)
    setOpen(false)
  }

  const handleLogout = async () => {
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`, {})
      if (response.status === 200) {
        toast.success(response.data.message)
        setUser(null)
        router.push('/login')
        setOpen(false)
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const navigationItems = [
    {
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      route: '/',
      description: 'Return to the main page and explore our features',
      show: true
    },
    {
      label: user ? 'Upload Document' : 'Try it Free',
      icon: <Upload className="w-5 h-5" />,
      route: '/upload',
      description: 'Effortlessly upload your documents for quick analysis. Get instant insights and actionable summaries.',
      show: true,
      primary: true
    },
    {
      label: 'Dashboard',
      icon: <FileText className="w-5 h-5" />,
      route: `/dashboard/${user?.username}`,
      description: 'Access all your uploaded documents and saved files',
      show: !!user
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      route: `/settings/${user?.username}`,
      description: 'Manage your account preferences and security settings',
      show: !!user
    }
  ];

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:w-80 p-0 flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Navigate through the application using the menu options below
            </SheetDescription>
          </SheetHeader>
          <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  👁 NyayNetra
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AI Legal Document Analysis
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {user && (
            <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Welcome, {user.username}!
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.filter(item => item.show).map((item, index) => (
              <div key={item.label} className="space-y-3">
                <Button
                  onClick={() => handleBtnClick(item.route)}
                  variant={item.primary ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 p-4 h-auto ${
                    item.primary 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`${item.primary ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${item.primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {item.label}
                    </div>
                  </div>
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400 px-4 leading-relaxed">
                  {item.description}
                </p>
                {index < navigationItems.filter(item => item.show).length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
            {!user && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <Button
                    onClick={() => handleBtnClick('/login')}
                    variant="outline"
                    className="w-full justify-start gap-3 p-4 h-auto border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-blue-700 dark:text-blue-300">
                        Login / Register
                      </div>
                    </div>
                  </Button>
                  <p className="text-xs text-gray-600 dark:text-gray-400 px-4 leading-relaxed">
                    Log in to access your account or register to create one and enjoy personalized features.
                  </p>
                </div>
              </>
            )}
            {user && (
              <>
                <Separator className="my-6" />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start gap-3 p-4 h-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">
                      Logout
                    </div>
                  </div>
                </Button>
              </>
            )}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  100% Secure & Private
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400">
                Your documents are encrypted and never stored permanently without your consent.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2025 👁 NyayNetra. All rights reserved.
              </p>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <span>Privacy</span>
                <span>•</span>
                <span>Terms</span>
                <span>•</span>
                <span>Support</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Hamburger
