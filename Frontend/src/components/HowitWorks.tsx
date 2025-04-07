'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { MoveRight,Save } from 'lucide-react'
import DocumentPhoto from '../../public/Documents-rafiki.png'
import Analysis from "../../public/Data extraction-bro.png"
import Insights from '../../public/Visual data-amico.png'

import Image from 'next/image'
import { Button } from './ui/button'


function HowitWorks() {
  return (
    <>
         <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
        How it Works
      </h1>
    <section className='h-full  '>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4     text-black  gap-4  mt-8 '>
      <div className='flex justify-center  min-h-[50vh]  '>
      <Card className='h-full  bg-white text-black'>
      <CardTitle className='flex justify-center items-center'>Step 1</CardTitle>
  <CardContent className='h-[25vh] flex justify-center items-center'>
    <Image
      className="h-[25vh] w-[25vh] rounded-lg object-cover"
      src={DocumentPhoto}
      alt="Document Image"
      layout="intrinsic"
    />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Upload Document</CardTitle>
            <CardDescription className='flex justify-center items-center text-black'>Easily upload any document for analysis</CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='flex justify-center  min-h-[50vh] '>
      <Card className='h-full  bg-white text-black'>
      <CardTitle className='flex justify-center items-center'>Step 2</CardTitle>
  <CardContent className='h-[25vh] flex justify-center items-center'>
    <Image
      className="h-[25vh] w-[25vh] rounded-lg object-cover"
      src={Analysis}
      alt="Document Image"
      layout="intrinsic"
    />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>AI Analysis</CardTitle>
            <CardDescription className='flex justify-center items-center text-black'>"Our AI extracts key details in seconds"</CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='flex justify-center  min-h-[50vh] '>
      <Card className='h-full  bg-white text-black'>
      <CardTitle className='flex justify-center items-center'>Step 3</CardTitle>
  <CardContent className='h-[25vh] flex justify-center items-center'>
    <Image
      className="h-[25vh] w-[25vh] rounded-lg object-cover"
      src={Insights}
      alt="Document Image"
      layout="intrinsic"
    />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Review Insights</CardTitle>
            <CardDescription className='flex justify-center items-center text-black'>"Get key details from the document—summaries, clauses, and more"</CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='flex justify-center  min-h-[50vh] '>
      <Card className='h-full  bg-white text-black'>
      <CardTitle className='flex justify-center items-center'>Step 4</CardTitle>
  <CardContent className='h-[25vh]  flex justify-center items-center'>
            <Save size={150}/>
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Save</CardTitle>
            <CardDescription className='flex justify-center items-center text-black'> "Save your analysis for future reference"</CardDescription>
            </CardHeader>
        </Card>
        </div>
      </div>
         <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh] flex ">
                     <Button
                     className='mb-1 lg:h-full lg:w-full mr-4 bg-[#1338BE] text-white'>Upload Document</Button>
                     <Button className='lg:h-full lg:w-full'>Try as a Guest</Button>
     
                 </div>
    </section>
    </>
  )
}

export default HowitWorks