import React from 'react'
import { Button } from './ui/button'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation';
function CTASection() {
   const router = useRouter();
   const { user} = useUser();
   const handleBtnClick = (route:string)=>{
    router.push(route)
  }
  return (
    <section className='h-full   p-4 ' >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl text-center ">
        Revolutionize Your Legal Workflow with Just One Click!
      </h1>
         <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh]  ">
                        <Button
                        onClick={()=>handleBtnClick('upload')}
                        className='mb-1 lg:h-full lg:w-full mr-4 bg-orange-500 text-white text-lg hover:bg-orange-700 cursor-pointer border-1 border-black'>{
                          user?("Upload Document"):("Start free Trail")
                          
                        }</Button>
                    </div>
      </section>
  )
}

export default CTASection