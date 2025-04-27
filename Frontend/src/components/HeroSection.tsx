'use client'
import React from 'react'
import photo from '../../public/heroPhotonew.jpg'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
function HeroSection() {
   const router = useRouter();
      const handleBtnClick = (route:string)=>{
        router.push(route)
      }
  return (
    <section className=' p-8'>
       <div className='grid  h-full  sm:grid-cols-12 '>
        <div className="left ml-4   rounded  sm:col-span-7 sm:p-8 text-black">
        <h1 className="scroll-m-20 text-4xl font-semibold text-gray-800 tracking-tight lg:text-6xl lg:text-gray-900 leading-tight">
        Review Legal Documents <span className='text-orange-500'>10x Faster</span> — With Complete Confidence.
            </h1>            
            <h3 className="scroll-m-20 text-xl  tracking-tight pt-4">AI-powered analysis that spots errors, highlights risks, and saves you hours — so you focus on what matters most.</h3>
            <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh] flex ">
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='mb-1 lg:h-full lg:w-full mr-4 bg-orange-500 text-white '>Upload Document</Button>
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='lg:h-full lg:w-full border-black border-1'>Try as Guest</Button>

            </div>
         </div>
        <div className="right  rounded-lg   sm:col-span-5"> 
        <Image
         className="h-full  w-full rounded-lg"
        src={photo}
        alt=""
         layout="responsive"
        />
        </div>
       </div>
    </section>
  )
}

export default HeroSection