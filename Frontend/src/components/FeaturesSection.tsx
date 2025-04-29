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
    <section className=' p-4 ' >
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center ">
        Features
      </h1>
      <div className='grid   sm:grid-cols-12 gap-4 mt-8'>
        <div className='sm:col-span-4    '>
        <Card className='    flex justify-center  '>
            <CardContent className='flex justify-center items-center   '>
            <Zap color="#f97316" size={100} />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Fast Processing</CardTitle>
            <h2 className='font-bold text-orange-500'>Get results in seconds, not hours.</h2>
            <CardDescription className=''>Our AI engine swiftly analyzes complex legal documents, helping you save precious time and speed up decision-making.

        </CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='sm:col-span-4'>
        <Card className='  flex justify-center  '>
            <CardContent className='flex justify-center items-center   '>
            <BarChart color="#f97316" size={100} />
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Accurate Insights</CardTitle>
            <h2 className='font-bold text-orange-500'>Pinpoint the details that matter.</h2>
            <CardDescription> We deliver precise risk flags, hidden clauses, and compliance issues — so you can act confidently without missing anything important.

            </CardDescription>
            </CardHeader>
        </Card>
        </div>
        <div className='sm:col-span-4'>
        <Card className='  flex justify-center'>
            <CardContent className='flex justify-center items-center   '>
            <ShieldCheck color="#f97316" size={100}/>
            </CardContent>
            <CardHeader >
            <CardTitle className='flex justify-center items-center'>Private and Secure</CardTitle>
            <h2 className='font-bold text-orange-500'>Your data stays yours, always.</h2>
            <CardDescription>  End-to-end encryption and strict confidentiality ensure that your sensitive documents are analyzed safely without any exposure.</CardDescription>
            </CardHeader>
        </Card>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection