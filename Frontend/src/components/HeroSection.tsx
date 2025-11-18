'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { ArrowRight} from 'lucide-react'

function HeroSection() {
  const { user } = useUser()
  const router = useRouter()

  const handleBtnClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className="relative h-screen pt-5 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:from-blue-950/10 dark:to-purple-950/10 z-0" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-6">
          Review Legal Documents{" "}
          <span className="relative">
            <span className="text-orange-500">
              10x Faster
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20"></div>
          </span>
          {" "}— With Complete Confidence.
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
          AI-powered analysis that{" "}
          <span className="font-semibold text-orange-500">
            spots errors, highlights risks, and saves you hours
          </span>
          {" "}— so you focus on what matters most.
        </p>
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={() => handleBtnClick('upload')}
            size="lg"
            className="bg-blue-500 hover:bg-black dark:hover:border-2 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {user ? 'Upload Document' : 'Try it Free - No Signup'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  )
}

export default HeroSection
