import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import testimonialsData from '../data/testimonials.json'
interface User{
    name:String,
    position:String,
    company:String,
    feedback:String,
    rating:number
}

function Testimonials() {

  return (
    <section className=''>
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
   What our User Say's
 </h1>
 <div className='grid  h-[50vh]   text-black sm:grid-cols-12 gap-4  mt-8 '>
 {testimonialsData.map((user: User) => (
        <div className='sm:col-span-3  h-[50vh] w-[20vw] '>
      <Card className='h-full  bg-white text-black'>
      <CardTitle className='flex justify-center'>{user.name}</CardTitle>
            <CardDescription className='flex justify-center'>{user.position} at {user.company}</CardDescription>
            <CardContent>
                <p>{user.feedback}</p>
                <p>Rating: {user.rating} stars</p>
              </CardContent>
        </Card>
        </div>

    ))}
 </div>
 </section>
  )
}

export default Testimonials