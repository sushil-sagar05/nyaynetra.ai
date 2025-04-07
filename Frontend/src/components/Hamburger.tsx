'use client'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu,Upload,BadgeIndianRupee,User,VenetianMask } from 'lucide-react'
import { Button } from './ui/button'
function Hamburger() {
  return (
    <div>
        <Sheet>
  <SheetTrigger><Menu size={35}/></SheetTrigger>
  <SheetContent>
    <SheetHeader className='mt-8'>
      <SheetTitle><Button><span className='flex gap-2' >Upload<Upload/></span></Button></SheetTitle>
      <SheetDescription>
      Effortlessly upload your documents for quick analysis. Get instant insights and actionable summaries from contracts, reports, and other text-heavy files with just a few clicks.
      </SheetDescription>
      <SheetTitle className='mt-4'><Button><span className='flex gap-2 ' >Plans <BadgeIndianRupee/></span></Button></SheetTitle>
      <SheetDescription>
      Explore our flexible pricing plans. Choose the best option for guests or authenticated users, with tailored features and benefits to suit your needs.
      </SheetDescription>
      <SheetTitle className='mt-4'><Button><span className='flex gap-2'>Login/Register <User/></span></Button></SheetTitle>
      <SheetDescription>
      Log in to access your account or register to create one and enjoy personalized features, secure access, and seamless document management.
      </SheetDescription>
    </SheetHeader>
    <Button><span className='flex gap-1'> Try as guest <VenetianMask className='mt-1'/></span></Button>
  <p className='text-white text-center'>© 2025 👁Nyaynetra. All rights reserved.</p>
  </SheetContent>
</Sheet>
    </div>
  )
}

export default Hamburger