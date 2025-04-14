'use client'
import React, { useState } from 'react'
import Setting_sidebar from '@/components/Settings_sidebar';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { ChevronRight, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
function page() {
    const [activeTab, setActiveTab] = useState("Account Settings")
  return (
    <div className=" sm:grid sm:grid-cols-12 overflow-y-auto h-[85vh] ">
        <div className='hidden sm:block sm:col-span-2  '>
           <Setting_sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>
        <div className='col-span-12   overflow-y-auto sm:col-span-10 text-black bg-white'>
        <Tabs  className=" justify-start gap-4 mb-4">
        <TabsList className=" justify-start gap-4 mb-4">
        <TabsTrigger value="Account Settings">Account Settings</TabsTrigger>
        <TabsTrigger value="Prefrence">Prefrence</TabsTrigger>
        <TabsTrigger value="Privacy">Privacy</TabsTrigger>
        <TabsTrigger value="Help">Help</TabsTrigger>
      </TabsList>

      <TabsContent value="Account Settings">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" >Account Settings</h1>
            <div className="card  p-8 w-[75vw]">
                <div className="inner  p-6 h-full w-[35vw]">
                <div className="card1  ">
                    <Card className='h-full bg-white text-black  '>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <User 
                        className='rounded-full border-2 border-white'
                        size={40}/>
                       </span>
                       <span >
                        <p className='font-bold'>John Doe</p>
                        <p>John@hie.com</p>
                       </span>
                       </div>
                      <div>
                      <ChevronRight/>
                      </div>
                    </CardContent>
                    </Card>
                </div>
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Language </h3>
                <div className="card1  mt-2 ">
                    <Card className='h-full  flex justify-center bg-white text-black '>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <p className='font-bold'>English (en)</p>
                       </span>
                       </div>
                      <div>
                      <ChevronRight/>
                      </div>
                    </CardContent>
                    </Card>
                </div>
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Appearance </h3>
                <div className="card1 mt-2 ">
                    <Card className='h-full  flex justify-center bg-white text-black '>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <p className='font-bold'>Dark Mode</p>
                       </span>
                       </div>
                      <div>
                      <Switch></Switch>
                      </div>
                    </CardContent>
                    </Card>
                    <Card className='h-full  flex justify-center mt-2 bg-white text-black'>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <p className='font-bold'>Auto Save</p>
                       </span>
                       </div>
                      <div>
                      <Switch ></Switch>
                      </div>
                    </CardContent>
                    </Card>
                </div>
                <div className="dangerZone h-[20vh]  text-black mt-8">
                <Card className='h-full p-8 bg-white text-black border-2 border-black rounded-md border-dotted'>
                <CardTitle className='text-red-600 text-md font-bold'>Danger Zone</CardTitle>
                <CardContent>
                    <Button>
                    Delete Account
                    </Button>
                </CardContent>
                </Card>
                </div>
                </div>

            </div>
      </TabsContent>
        </Tabs>
        </div>
        </div>
  )
}

export default page