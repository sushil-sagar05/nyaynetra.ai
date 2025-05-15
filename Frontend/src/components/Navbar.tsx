'use client';
import React from 'react';
import { Upload, User } from 'lucide-react';
import Hamburger from './Hamburger';
import { useUser } from '../context/UserContext';
import ThemeToggle from './toggle';
import Link from 'next/link';
import { Button } from './ui/button';

function Navbar() {
  const { user } = useUser();

  return (
    <nav className='sticky top-0 z-50 bg-white dark:bg-background shadow-md p-4 md:p-6 w-full'>
      <div className='container grid grid-cols-12 w-full'>
        <div className="col-span-7 sm:col-span-5 md:col-span-2 flex justify-start items-center">
          <Link href="/" className="text-sm sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 cursor-pointer">Nyaynetra </Link>
        </div>

        <div className="hidden col-span-7 sm:col-span-9 md:col-span-10 md:flex gap-8 justify-end items-center">
          <ThemeToggle />

          <Link href="/upload" className="font-bold text-sm ">
            <span className='flex gap-2'>Upload<Upload  /></span>
          </Link>

          {user == null ? (
            <Link href="/login" className="font-bold text-sm "><Button
            className=' bg-blue-600 cursor-pointer  border-4 border-blue-400'
            >Login</Button></Link>
          ) : (
            <Link href={`/dashboard/${user?.username}`} className="font-bold text-sm">
              <span className='flex gap-2'>Profile<User  /></span>
            </Link>
          )}
        </div>

        <div className='sm:hidden flex justify-end col-span-4 gap-4'>
          <ThemeToggle />
          <Hamburger />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
