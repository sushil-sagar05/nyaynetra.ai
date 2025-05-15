import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from './ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import testimonialsData from '../data/testimonials.json'

interface User {
  name: string,
  position: string,
  company: string,
  feedback: string,
  rating: number,
}

function Testimonials() {
  return (
    <section className="px-6 md:px-12 py-16 bg-background text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-4xl font-bold leading-snug">
            <span className="text-orange-500 block">Real Stories, Real Confidence</span>
            See How AI is Revolutionizing Legal Review.
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full" />
        </div>
        <div className="md:col-span-7">
          <div className="w-full max-w-xl mx-auto ">
            <Carousel className="w-full  ">
              <CarouselContent>
                {testimonialsData.map((user: User, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-6 shadow-lg bg-muted/50 backdrop-blur rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                          <CardHeader className="text-sm text-muted-foreground">{user.position} at {user.company}</CardHeader>
                        </div>
                      </div>
                      <CardContent>
                        <p className="text-base leading-relaxed text-center italic text-foreground">
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
              Swipe to read more →
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
