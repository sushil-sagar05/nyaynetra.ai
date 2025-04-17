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
      <section className=" px-4 sm:px-6 md:px-12 lg:px-20 py-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-black mt-8">
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-white text-black">
        <CardTitle className="text-center mt-4">Step 1</CardTitle>
        <CardContent className="h-[25vh] flex justify-center items-center">
          <Image
            className="h-[25vh] w-[25vh] rounded-lg object-cover"
            src={DocumentPhoto}
            alt="Document Upload"
            layout="intrinsic"
          />
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center">Upload Document</CardTitle>
          <CardDescription className="text-center">Easily upload any document for analysis</CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-white text-black">
        <CardTitle className="text-center mt-4">Step 2</CardTitle>
        <CardContent className="h-[25vh] flex justify-center items-center">
          <Image
            className="h-[25vh] w-[25vh] rounded-lg object-cover"
            src={Analysis}
            alt="AI Analysis"
            layout="intrinsic"
          />
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center">AI Analysis</CardTitle>
          <CardDescription className="text-center">Our AI extracts key details in seconds</CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-white text-black">
        <CardTitle className="text-center mt-4">Step 3</CardTitle>
        <CardContent className="h-[25vh] flex justify-center items-center">
          <Image
            className="h-[25vh] w-[25vh] rounded-lg object-cover"
            src={Insights}
            alt="Review Insights"
            layout="intrinsic"
          />
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center">Review Insights</CardTitle>
          <CardDescription className="text-center">Get key details from the document—summaries, clauses, and more</CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-white text-black">
        <CardTitle className="text-center mt-4">Step 4</CardTitle>
        <CardContent className="h-[25vh] flex justify-center items-center">
          <Save size={100} />
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center">Save</CardTitle>
          <CardDescription className="text-center">Save your analysis for future reference</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full">
    <Button className="bg-[#1338BE] text-white w-full sm:w-auto px-6 py-3">Upload Document</Button>
    <Button className="w-full sm:w-auto px-6 py-3">Try as a Guest</Button>
  </div>
</section>

    </>
  )
}

export default HowitWorks