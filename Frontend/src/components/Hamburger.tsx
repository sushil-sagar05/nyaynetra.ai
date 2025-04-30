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
import { Menu,Upload,User, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'
import ThemeToggle from './toggle'
import api from '@/lib/api'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
function Hamburger() {
  const {user,setUser} = useUser()
  const router = useRouter();
  const handleBtnClick = (route:string)=>{
    router.push(route)
  }
  const handleLogout =async()=>{
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`,{})
      if(response.status===200){
        toast.success(response.data.message)
        setUser(null)
        router.push('/login')
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
 
  }
  return (
    <div>
        <Sheet>
  <SheetTrigger><Menu size={35}/></SheetTrigger>
  <SheetContent>
    <SheetTitle className='p-8 flex gap-4'>
      <p>Change Mode</p>
      <ThemeToggle/>
    </SheetTitle>
    <SheetHeader className=''>
      <SheetTitle><Button
      onClick={()=>handleBtnClick('/upload')}
      ><span className='flex gap-2' >{user?("Upload Document"):("Try it  free")}<Upload/></span></Button></SheetTitle>
      <SheetDescription>
      Effortlessly upload your documents for quick analysis. Get instant insights and actionable summaries from contracts, reports, and other text-heavy files with just a few clicks.
      </SheetDescription>
      {
        user==null?<>
        <SheetTitle className='mt-4'><Button
      onClick={()=>handleBtnClick('/login')}
      ><span className='flex gap-2'>Login/Register <User/></span></Button></SheetTitle>
      <SheetDescription>
      Log in to access your account or register to create one and enjoy personalized features, secure access, and seamless document management.
      </SheetDescription>
        </>:
        <>
        <SheetTitle className='mt-4'><Button
      onClick={()=>router.push(`/dashboard/${user?.username}`)}
      ><span className='flex gap-2'>Profile<User/></span></Button></SheetTitle>
      <SheetDescription>
     Go to profile and access all your uploaded document and saved document
      </SheetDescription>
        </>
      }
    </SheetHeader>
    {
      user!=null?<>
      <SheetTitle className='mt-4 ml-3'><Button
    onClick={()=>router.push(`/settings/${user?.username}`)}
    ><span className='flex gap-2'> Settings <Settings/></span></Button></SheetTitle>
    <SheetDescription className='p-4'>
     Go to Settings and check or update your credentials
      </SheetDescription>
      </>:""
    }
    {
      user!=null?<>
      <SheetTitle className='mt-4 ml-3'><Button
    onClick={()=>handleLogout()}
    ><span className='flex gap-2'> Logout </span></Button></SheetTitle>
      </>:""
    }
  <p className=' text-center p-4'>© 2025 👁Nyaynetra. All rights reserved.</p>
  </SheetContent>
</Sheet>
    </div>
  )
}

export default Hamburger