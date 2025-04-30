import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import testimonialsData from '../data/testimonials.json'
interface User{
    name:string,
    position:string,
    company:string,
    feedback:string,
    rating:number
}

function Testimonials() {

  return (
    <section className="px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-5">
        <h2 className="text-4xl font-bold leading-snug">
          <span className="text-orange-500 block">Real Stories, Real Confidence</span>
          See How AI is Revolutionizing Legal Review.
        </h2>
      </div>
      <div className="md:col-span-7">
        <div className="w-full max-w-lg mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonialsData.map((user: User, index) => (
                <CarouselItem key={index}>
                  <Card className='p-4'>
                    <CardTitle className='pl-6'>{user.name}</CardTitle>
                      <CardHeader>{user.position} at {user.company}</CardHeader>
                    <CardContent >
                      <p className="text-lg font-medium text-center">
                        “{user.feedback}”
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="pt-4 text-center text-sm text-muted-foreground">
            Swipe to read more
          </div>
        </div>
      </div>
    </div>
  </section>
  
  )
}

export default Testimonials