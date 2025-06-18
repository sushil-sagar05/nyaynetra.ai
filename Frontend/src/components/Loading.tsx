'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface LoadingModalProps {
  isOpen: boolean
}

const messages = [
  "Analyzing legal clauses...",
  "Detecting risks...",
  "Generating summary...",
  "Finalizing insights...",
  "Almost there..."
]

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  // Message rotation every 10 seconds
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Handle close attempt
  const handleCancelAttempt = () => {
    setShowConfirm(true)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => {
            e.preventDefault()
            handleCancelAttempt()
          }}
          onInteractOutside={(e) => {
            e.preventDefault()
            handleCancelAttempt()
          }}
          className="flex flex-col items-center justify-center space-y-4 p-6 max-w-sm text-center"
        >
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-muted-foreground text-sm">
            {messages[currentIndex]}
          </p>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for confirmation */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel loading and refresh the page?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <button
              onClick={refreshPage}
              className="inline-flex justify-center rounded-md bg-destructive px-4 py-2 text-white hover:bg-red-600"
            >
              Refresh
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LoadingModal
