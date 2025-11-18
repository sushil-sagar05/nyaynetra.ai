import React from 'react'
import { Button } from './ui/button'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

function CTASection() {
  const router = useRouter()
  const { user } = useUser()

  const handleBtnClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className='py-16 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-8">
          Revolutionize Your Legal Workflow with{' '}
          <span className='text-orange-500 bg-clip-text  inline-block hover:scale-105 transition-transform duration-300'>
            Just One Click!
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Join thousands of legal professionals who have transformed their document review process with our AI-powered analysis.
        </p>
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={() => handleBtnClick('upload')}
            size="lg"
            className="bg-blue-500 hover:bg-black dark:hover:border-2 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {user ? "Upload Document" : "Start Free Trial"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

        </div>
      </div>
    </section>
  )
}

export default CTASection
