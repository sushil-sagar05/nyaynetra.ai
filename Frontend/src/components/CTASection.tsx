import React from 'react'
import { Button } from './ui/button'

function CTASection() {
  return (
    <section className='h-full   p-4 ' >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl text-center text-black">
        Revolutionize Your Legal Workflow with Just One Click!
      </h1>
         <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh] flex ">
                     <Button
                     className='mb-1 lg:h-full lg:w-full mr-4 bg-[#1338BE] text-white'>Upload Document</Button>
                     <Button className='lg:h-full lg:w-full'>Try as a Guest</Button>
     
                 </div>
      </section>
  )
}

export default CTASection