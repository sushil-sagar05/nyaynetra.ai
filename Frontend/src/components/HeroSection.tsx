'use client'
import React from 'react'
import photo from '../../public/heroPhoto.jpg'
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
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" >Ai-powered legal document analysis</h1>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-8">Analyze your legal document with our cutting-edge ai technology </h3>
            <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh] flex ">
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='mb-1 lg:h-full lg:w-full mr-4 bg-[#1338BE] text-white'>Upload Document</Button>
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='lg:h-full lg:w-full'>Try as a Guest</Button>

            </div>
         </div>
        <div className="right  rounded-lg   sm:col-span-5"> 
        <Image
         className="h-full w-full rounded-lg"
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