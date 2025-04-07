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
    <section className='h-full'>
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
   What our User Say's
 </h1>
 <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4     text-black  gap-4  mt-8 '>
 {testimonialsData.map((user: User) => (
        <div className='flex justify-center    '>
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