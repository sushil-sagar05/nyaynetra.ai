import React from 'react'
import { Button } from './ui/button'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

function CTASection() {
  const router = useRouter()
  const { user } = useUser()

  const handleBtnClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className='h-full p-8 flex flex-col items-center'>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl text-center">
        Revolutionize Your Legal Workflow with{' '}
        <span className='bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300'>
          Just One Click!
        </span>
      </h1>

      <div className="mt-12 w-full max-w-xs lg:max-w-sm">
        <Button
          onClick={() => handleBtnClick('upload')}
          className='w-full bg-gradient-to-r from-purple-600 to-blue-500 text-lg cursor-pointer border border-black transition-colors duration-300'
        >
          {user ? "Upload Document" : "Start free Trial"}
        </Button>
      </div>
    </section>
  )
}

export default CTASection
