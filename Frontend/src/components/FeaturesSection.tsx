'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {Zap,ShieldCheck,BarChart} from 'lucide-react'
function FeaturesSection() {
  return (
    <section className='h-full  p-4 ' >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
        Features
      </h1>
      <div className='grid  h-[50vh]  text-black sm:grid-cols-12 gap-4 mt-8'>
        <div className='sm:col-span-4 min-h-[20vh]  '>
        <Card className='h-[45vh]  flex justify-center bg-white text-black'>
            <CardContent className='flex justify-center items-center   '>
            <Zap color="#1338BE" size={100} className='bg-slate-100 rounded-lg' />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Fast Processing</CardTitle>
            <CardDescription className='text-black'>Our AI swiftly analyzes your documents, extracting key information and insights in seconds. Whether it’s contracts, reports, or other text-heavy files, our system highlights important details, saving you time and effort by providing clear, actionable summaries.</CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='sm:col-span-4 min-h-[20vh]  '>
        <Card className='h-[45vh]  flex justify-center bg-white text-black'>
            <CardContent className='flex justify-center items-center   '>
            <BarChart color="#1338BE" size={100} className='bg-slate-100 rounded-lg' />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Accurate Insights</CardTitle>
            <CardDescription className='text-black'>  Our AI quickly processes your documents, providing accurate and reliable insights in real-time. From contracts and financial reports to complex text-heavy files, it extracts and highlights the most crucial information. This helps you save time, avoid manual analysis, and make data-driven decisions with confidence.

            </CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='sm:col-span-4 min-h-[20vh]  '>
        <Card className='h-[45vh]  flex justify-center bg-white text-black'>
            <CardContent className='flex justify-center items-center   '>
            <ShieldCheck color="#1338BE" size={100} className='bg-slate-100 rounded-lg' />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Private and Secure</CardTitle>
            <CardDescription className='text-black'>  Your documents are processed with the utmost security and privacy. We ensure that all data remains confidential, with advanced encryption and secure handling at every step. Whether it's contracts, reports, or sensitive files, you can trust that your information is protected while gaining accurate and actionable insights.</CardDescription>
            </CardHeader>
        </Card>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection