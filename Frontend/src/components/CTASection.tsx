import React from 'react'
import { Button } from './ui/button'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Zap } from 'lucide-react'

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
          <span className='bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300'>
            Just One Click!
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Join thousands of legal professionals who have transformed their document review process with our AI-powered analysis.
        </p>
        <div className="flex flex-col items-center gap-6">
          {!user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-300">
                No credit card required — your data stays{" "}
                <span className="font-semibold">100% secure</span>
              </span>
            </div>
          )}
          <Button
            onClick={() => handleBtnClick('upload')}
            size="lg"
            className='bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0'
          >
            {user ? "Upload Document" : "Start Free Trial"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-gray-500 dark:text-gray-400 mt-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>No Setup Required</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Trusted by legal professionals worldwide
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">10K+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Documents Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">95%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">4.9/5</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
