'use client';

import React, { useState, useEffect } from 'react';
import Setting_sidebar from '@/components/Settings_sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Account_Settings from '@/components/Account_Settings';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

function Page() {
  const { user,loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Account Settings');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const tabs = [
    { label: 'Account Settings', content: <Account_Settings /> },
    { label: 'Preferences', content: <h1 className="text-3xl font-semibold">Preferences</h1> },
    { label: 'Privacy', content: <h1 className="text-3xl font-semibold">Privacy</h1> },
    { label: 'Help', content: <h1 className="text-3xl font-semibold">Help</h1> },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 sm:grid-cols-12">
      <aside className="hidden sm:block sm:col-span-2 h-full border-r">
        <Setting_sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>
      <main className="col-span-12 sm:col-span-10 p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 sm:ml-4 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

export default Page;
