'use client';

import React, { useState, useEffect } from 'react';
import Setting_sidebar from '@/components/Settings_sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Account_Settings from '@/components/Account_Settings';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { User, Settings, Shield, HelpCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Page() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Account Settings');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { 
      label: 'Account Settings', 
      icon: <User className="w-4 h-4" />,
      content: <Account_Settings /> 
    },
    { 
      label: 'Preferences', 
      icon: <Settings className="w-4 h-4" />,
      content: (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Preferences Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                We're working on adding customization options to personalize your experience.
              </p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Features in development: Language settings, notification preferences, and display options.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    { 
      label: 'Privacy', 
      icon: <Shield className="w-4 h-4" />,
      content: (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Your Privacy is Protected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  We use end-to-end encryption and never store your documents permanently without your explicit consent.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-green-900 dark:text-green-300">
                      Data Encryption
                    </h4>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    All data is encrypted both in transit and at rest using industry-standard protocols.
                  </p>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                      No Permanent Storage
                    </h4>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Documents are automatically deleted after 7 days unless you choose to save them.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Privacy Commitment
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    We never share your data with third parties
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    You maintain full control over your documents
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    GDPR and CCPA compliant data handling
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    { 
      label: 'Help', 
      icon: <HelpCircle className="w-4 h-4" />,
      content: (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    📚 Documentation
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                    Comprehensive guides on how to use all platform features
                  </p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                    View Documentation
                  </Button>
                </div>
                
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
                    💬 Contact Support
                  </h4>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                    Get help from our expert support team
                  </p>
                  <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                    Contact Support
                  </Button>
                </div>

                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                    ❓ FAQ
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                    Quick answers to frequently asked questions
                  </p>
                  <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                    Browse FAQ
                  </Button>
                </div>

                <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3">
                    🎥 Video Tutorials
                  </h4>
                  <p className="text-orange-700 dark:text-orange-300 text-sm mb-4">
                    Step-by-step video guides for common tasks
                  </p>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                    Watch Tutorials
                  </Button>
                </div>
              </div>
              
              <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Need immediate assistance?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Our support team typically responds within 24 hours
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Expert Team</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <aside className="hidden lg:block lg:col-span-3 w-full">
            <div className="sticky top-8 w-full">
              <Setting_sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>
          <main className="lg:col-span-9 w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="lg:hidden mb-6 w-full">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.label} 
                      value={tab.label}
                      className="flex items-center gap-2 text-xs sm:text-sm p-2"
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {tabs.map((tab) => (
                <TabsContent 
                  key={tab.label} 
                  value={tab.label} 
                  className="mt-0 focus-visible:outline-none w-full"
                >
                  <div className="space-y-6 w-full">
                    <div className="hidden lg:block">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <span>Settings</span>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {tab.label}
                        </span>
                      </div>
                    </div>
                    <div className="min-h-[500px] w-full">
                      {tab.content}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Page;
