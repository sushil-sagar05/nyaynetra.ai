'use client'
import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

import uploadO from '../../public/upload-nyaynetra.png'
import AnalysisO from '../../public/analysis-nyaynetra.png'
import ReviewO from '../../public/analysis2-nyaynetra.png'
import Step4o from '../../public/chat-nyaynetra.png'

type ColorType = 'blue' | 'green' | 'purple' | 'orange'

interface StepItem {
  title: string;
  shortTitle: string;
  fullTitle: string;
  shortDesc: string;
  desc: string;
  image: StaticImageData; 
  step: string;
  color: ColorType; 
  features: string[];
}

const items: StepItem[] = [
  {
    title: "Upload Document",
    shortTitle: "Upload",
    fullTitle: "1. Upload your Document",
    shortDesc: "Upload legal documents instantly",
    desc: "Easily upload contracts, agreements, or any legal document for instant AI-powered analysis with support for multiple file formats.",
    image: uploadO,
    step: "Step 1 of 4",
    color: "blue",
    features: ["PDF, DOCX, TXT support", "Drag & drop interface", "Secure file encryption", "Instant processing"]
  },
  {
    title: "Analyze Document",
    shortTitle: "Analyze",
    fullTitle: "2. AI-Powered Analysis", 
    shortDesc: "AI scans and extracts insights",
    desc: "Our advanced AI scans and interprets every section, extracting key clauses, risks, and insights using state-of-the-art NLP technology.",
    image: AnalysisO,
    step: "Step 2 of 4",
    color: "green",
    features: ["Deep clause extraction", "Risk assessment", "Legal terminology analysis", "Context understanding"]
  },
  {
    title: "Review Results",
    shortTitle: "Review",
    fullTitle: "3. Review & Understand",
    shortDesc: "View summaries and risks",
    desc: "View detailed summaries, important clauses, obligations, and potential risks highlighted with clear explanations and actionable insights.",
    image: ReviewO,
    step: "Step 3 of 4", 
    color: "purple",
    features: ["Interactive summaries", "Risk highlighting", "Clause categorization", "Export options"]
  },
  {
    title: "Ask with NyayAi",
    shortTitle: "Chat",
    fullTitle: "4. Interactive Q&A",
    shortDesc: "Ask questions about your document",
    desc: "Chat with your document using NyayAI - ask specific questions, clarify terms, and get instant answers about any aspect of your legal document.",
    image: Step4o,
    step: "Step 4 of 4",
    color: "orange",
    features: ["Natural language queries", "Contextual responses", "Document citations", "24/7 availability"]
  },
]

const colorStyles: Record<ColorType, {
  active: string;
  inactive: string;
  number: string;
  activeNumber: string;
  gradient: string;
  badge: string;
}> = {
  blue: {
    active: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900/20',
    inactive: 'hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 dark:hover:border-blue-800',
    number: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    activeNumber: 'bg-white text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  },
  green: {
    active: 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500 shadow-lg shadow-green-200 dark:shadow-green-900/20',
    inactive: 'hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/20 dark:hover:border-green-800',
    number: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    activeNumber: 'bg-white text-green-600',
    gradient: 'from-green-500 to-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  },
  purple: {
    active: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/20',
    inactive: 'hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950/20 dark:hover:border-purple-800',
    number: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    activeNumber: 'bg-white text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  },
  orange: {
    active: 'bg-gradient-to-r from-orange-600 to-orange-700 text-white border-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/20',
    inactive: 'hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950/20 dark:hover:border-orange-800',
    number: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    activeNumber: 'bg-white text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  }
}

function HowItWorks() {
  const [activeTab, setActiveTab] = useState(items[0].title)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    if (isAutoPlaying) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0
          }
          return prev + (100 / 60) 
        })
      }, 100)
      interval = setInterval(() => {
        setActiveTab(prev => {
          const currentIndex = items.findIndex(item => item.title === prev)
          const nextIndex = (currentIndex + 1) % items.length
          return items[nextIndex].title
        })
        setProgress(0)
      }, 6000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [isAutoPlaying])

  const handleTabChange = (tabTitle: string) => {
    setActiveTab(tabTitle)
    setProgress(0)
    setIsAutoPlaying(false)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
    if (!isAutoPlaying) {
      setProgress(0)
    }
  }

  const resetDemo = () => {
    setActiveTab(items[0].title)
    setProgress(0)
    setIsAutoPlaying(true)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">How It Works</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Transform Legal Analysis in{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Four Steps
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Experience the future of legal document analysis with our AI-powered platform that simplifies complex legal workflows
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className="flex items-center gap-2"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoPlaying ? 'Pause Demo' : 'Play Demo'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDemo}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="space-y-3">
            {items.map((item, index) => {
              const isActive = activeTab === item.title
              const colors = colorStyles[item.color]
              
              return (
                <div key={item.title} className="relative">
                  <button
                    onClick={() => handleTabChange(item.title)}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all duration-300 border-2 group
                      ${isActive 
                        ? colors.active
                        : `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 ${colors.inactive}`
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 flex items-center justify-center font-bold rounded-full text-sm flex-shrink-0 transition-all duration-300
                        ${isActive ? colors.activeNumber : colors.number}
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-lg mb-1 transition-colors ${
                          isActive ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200'
                        }`}>
                          {item.shortTitle}
                        </div>
                        <div className={`text-sm leading-relaxed ${
                          isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.shortDesc}
                        </div>
                      </div>
                    </div>
                  </button>
                  {isActive && isAutoPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {items.findIndex(item => item.title === activeTab) + 1}/4
              </span>
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${colorStyles[items.find(item => item.title === activeTab)?.color || 'blue'].gradient} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${((items.findIndex(item => item.title === activeTab) + 1) / items.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 order-1 lg:order-2">
          <Card className="overflow-hidden shadow-2xl border-0 bg-white dark:bg-gray-800">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {items.map((item) => (
                <TabsContent key={item.title} value={item.title} className="m-0">
                  <div className="relative group">
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.fullTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={item.title === items[0].title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <CardContent className="p-6 sm:p-8 bg-white dark:bg-gray-800">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${colorStyles[item.color].badge}`}>
                          {item.step}
                        </Badge>
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">AI Legal Analysis</span>
                        <div className="ml-auto">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorStyles[item.color].gradient} flex items-center justify-center`}>
                            <span className="text-white text-sm font-bold">
                              {items.findIndex(i => i.title === item.title) + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {item.fullTitle}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                        {item.desc}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {item.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorStyles[item.color].gradient}`}></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
