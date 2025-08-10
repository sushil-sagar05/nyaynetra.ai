'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Sparkles,
  Brain,
  Search,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react'

interface LoadingModalProps {
  isOpen: boolean
}

const loadingSteps = [
  {
    id: 1,
    message: "Initializing AI Analysis Engine...",
    description: "Setting up legal document processing",
    icon: Brain,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    id: 2,
    message: "Processing Document Structure...",
    description: "Analyzing document layout and content",
    icon: FileText,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    id: 3,
    message: "Generating AI Summary...",
    description: "Creating comprehensive document overview",
    icon: Sparkles,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  },
  {
    id: 4,
    message: "Identifying Key Legal Clauses...",
    description: "Extracting important contractual terms",
    icon: Search,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-800"
  },
  {
    id: 5,
    message: "Analyzing Risk Factors...",
    description: "Detecting potential legal concerns",
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    id: 6,
    message: "Securing Analysis Results...",
    description: "Protecting your document insights",
    icon: Shield,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800"
  },
  {
    id: 7,
    message: "Finalizing Legal Insights...",
    description: "Preparing comprehensive analysis",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    id: 8,
    message: "Almost Ready...",
    description: "Polishing final results for you",
    icon: Sparkles,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800"
  }
]

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0)
      setProgress(0)
      setTimeElapsed(0)
      return
    }
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % loadingSteps.length
        setProgress(((newIndex + 1) / loadingSteps.length) * 100)
        return newIndex
      })
    }, 4000) 
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [isOpen])

  const handleCancelAttempt = () => {
    setShowConfirm(true)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentStep = loadingSteps[currentIndex]
  const Icon = currentStep.icon

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTitle className="sr-only">AI Legal Document Analysis in Progress</DialogTitle>
        <DialogContent
          onEscapeKeyDown={(e) => {
            e.preventDefault()
            handleCancelAttempt()
          }}
          onInteractOutside={(e) => {
            e.preventDefault()
            handleCancelAttempt()
          }}
          className="max-w-md p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl"
        >
          <div className="relative px-6 pt-6 pb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    NyayAI Analysis
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Powered by Advanced Legal AI
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAttempt}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="px-6 py-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Step {currentIndex + 1} of {loadingSteps.length}
                </span>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {formatTime(timeElapsed)}
                </Badge>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
            </div>
          </div>
          <div className="px-6 py-4">
            <div className={`${currentStep.bgColor} ${currentStep.borderColor} border rounded-xl p-4 transition-all duration-500`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${currentStep.color}`} />
                    <Loader2 className="absolute -top-1 -right-1 w-3 h-3 animate-spin text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {currentStep.message}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Processing on free tier - may take 3-5 minutes</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {Math.round(progress)}%
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Complete</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {currentIndex + 1}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Steps Done</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">
                    {loadingSteps.length - (currentIndex + 1)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Remaining</div>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                Please keep this window open. Your analysis will be ready shortly.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900 border-0 shadow-2xl">
          <AlertDialogHeader className="space-y-4">
            <div className="mx-auto p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit">
              <RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-gray-900 dark:text-white">
              Stop Analysis & Refresh?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Your document analysis is currently in progress. Refreshing will restart the entire process.
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>You'll lose current progress ({Math.round(progress)}% complete)</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
              Continue Waiting
            </AlertDialogCancel>
            <Button
              onClick={refreshPage}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white border-0"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LoadingModal
