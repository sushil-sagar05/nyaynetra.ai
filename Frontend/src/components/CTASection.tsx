import React from 'react'
import { Button } from './ui/button'

function CTASection() {
  return (
    <section className='h-full  p-4 ' >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl text-center text-black">
        Revolutionize Your Legal Workflow with Just One Click!
      </h1>
      <div className="CTA mt-12 h-[8vh] w-[40vw] flex justify-center items-center m-8 ">
                <Button
                className='w-[15vw] h-full mr-4 bg-[#1338BE] text-white'>Upload Document</Button>
                <Button className='w-[15vw] h-full'>Try as a Guest</Button>

            </div>
      </section>
  )
}

export default CTASection