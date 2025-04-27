'use client'
import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import HowitWorks from '@/components/HowitWorks'
import ComparisonTable from '@/components/TablesComparision'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import FAQ from '@/components/FAQ'
function page() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection/>
      <section className="  p-8 ">
        <FeaturesSection />
      </section>
      <section className="min-h-screen p-8 ">
        <HowitWorks />
      </section>
      <section className=" min-h-screen p-8">
        <ComparisonTable />
      </section>
      <section className=" p-8">
        <Testimonials />
      </section>
      <section className=" p-8">
        <FAQ/>
      </section>
      <section className=" p-8">
        <CTASection/>
      </section>
    </main>
  )
}

export default page
