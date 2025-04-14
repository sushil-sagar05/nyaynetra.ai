'use client'
import React, { useState } from 'react'
import Setting_sidebar from '@/components/Settings_sidebar';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { ChevronRight, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs,TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account_Settings from '@/components/Account_Settings';
function page() {
    const [activeTab, setActiveTab] = useState("Account Settings")
  return (
    <div className=" sm:grid sm:grid-cols-12 overflow-y-auto h-[85vh] ">
        <div className='hidden sm:block sm:col-span-2  '>
           <Setting_sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>
        <div className='col-span-12   overflow-y-auto sm:col-span-10 text-black bg-white'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className=" justify-start gap-4 mb-4">
      <TabsContent value="Account Settings">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Account Settings</h1>
            <Account_Settings />
          </TabsContent>

          <TabsContent value="Prefrences">
            <h1 className="text-3xl font-semibold">Prefrences</h1>
          </TabsContent>

          <TabsContent value="Privacy">
            <h1 className="text-3xl font-semibold">Privacy</h1>
          </TabsContent>

          <TabsContent value="Help">
            <h1 className="text-3xl font-semibold">Help</h1>
          </TabsContent>
        </Tabs>
        </div>
        </div>
  )
}

export default page