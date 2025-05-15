'use client'
import React from 'react'
import photo from '../../public/Law firm-bro.png'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'
function HeroSection() {
   const { user} = useUser();
   const router = useRouter();

      const handleBtnClick = (route:string)=>{
        router.push(route)
      }
  return (
    <section className=' p-8'>
       <div className='grid  h-full  sm:grid-cols-12 '>
        <div className="left ml-4   rounded  sm:col-span-7 sm:p-8 ">
        <h1 className="scroll-m-20 text-4xl font-semibold  tracking-tight lg:text-6xl  leading-tight">
        Review Legal Documents <span className='font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 '>10x Faster</span> — With Complete Confidence.
            </h1>            
            <h3 className="scroll-m-20 text-xl  tracking-tight pt-4">AI-powered analysis that <span className='bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300'>spots errors, highlights risks, and saves you hours</span> — so you focus on what matters most.</h3>
            <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh]  ">
            {
              user?"":(<p className='mb-2 text-[12px] '>*No need to signup your data stays <span className='text-red-500'>100% private</span></p>)
            }
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='mb-4 lg:h-full lg:w-full mr-4 bg-gradient-to-r from-purple-600 to-blue-500 cursor-pointer '>{
                  user?("Upload Document"):("Try it free - No Signup")
                  
                }</Button>
            

            </div>
         </div>
        <div className="hidden sm:block relative min-h-[500px] w-full sm:col-span-5 rounded-lg"> 
        <Image
        className="h-full w-full rounded-lg object-cover"
        src={photo}
        alt="Hero"
        fill
        />
        </div>
       </div>
    </section>
  )
}

export default HeroSection