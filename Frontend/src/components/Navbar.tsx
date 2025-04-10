'use client'
import React from 'react'
import { Upload,Mail,User } from 'lucide-react'
import Hamburger from './Hamburger'
import { useUser } from '../context/UserContext';
function Navbar() {
  const { user } = useUser();
  return (
    <nav className='sticky top-0 z-10 bg-white shadow-md p-4 md:p-6 w-full text-black '>
         <div  className='container grid grid-cols-12 w-full'>
         <div className="col-span-7 sm:col-span-5 md:col-span-2  flex justify-start items-center ">
          <a href='/' className="font-bold text-3xl ">👁Nyaynetra</a>
      </div>
      <div className="hidden col-span-7 sm:col-span-9 md:col-span-10 md:flex  gap-4 justify-end items-center">
      <a href='/upload' className="font-bold text-3xl "><span className='flex gap-2'>Upload<Upload size={35}/></span></a>
      <a href='/support' className="font-bold text-3xl "><span className='flex gap-2'>Contact<Mail size={35}/></span></a>
      {
        user==null?(
          <a href='/login' className="font-bold text-3xl ">Login</a>
        ):(
          <a href={`/dashboard/${user?.fullName}`} className="font-bold text-3xl "><span className='flex gap-2'>Profile<User size={35}/></span></a>
        )
      }
      </div>
      <div className='sm:hidden flex justify-end  col-span-4'>
        <Hamburger/>
      </div>
         </div>
    </nav>
  )
}

export default Navbar
