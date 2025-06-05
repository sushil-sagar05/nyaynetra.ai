'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

function HeroSection() {
  const { user } = useUser()
  const router = useRouter()

  const handleBtnClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className="relative p-8 sm:h-[70vh] flex justify-center items-center overflow-hidden ">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          mixBlendMode: 'lighten',
        }}
      />
      <div className="relative  z-10 max-w-3xl text-center px-4">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-6xl leading-tight t pt-4">
          Review Legal Documents{" "}
          <span className="font-bold text-[#1d4ed7]">
            10x Faster
          </span>{" "}
          — With Complete Confidence.
        </h1>

        <h3 className="text-xl tracking-tight pt-4 ">
          AI-powered analysis that{" "}
          <span className="text-orange-500 ">
            spots errors, highlights risks, and saves you hours
          </span>{" "}
          — so you focus on what matters most.
        </h3>

        <div className="mt-12 flex flex-col items-center">
          {!user && (
            <p className="mb-2 text-[12px] text-gray-500 dark:text-gray-400">
              *No need to signup — your data stays{" "}
              <span className="text-red-500">100% private</span>
            </p>
          )}
          <Button
            onClick={() => handleBtnClick('upload')}
            className="bg-gradient-to-r from-purple-600 to-blue-500"
          >
            {user ? 'Upload Document' : 'Try it free - No Signup'}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
