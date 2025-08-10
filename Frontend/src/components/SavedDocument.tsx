'use client'
import { Save, FileText, Calendar, Clock, Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Delete from './Delete'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useUser } from '@/context/UserContext'
import api from '@/lib/api'

interface Document {
  id: string
  filename: string,
  ClouinaryUrl: string,
  createdAt: Date;
  fileType: string;
  public_id_fromCloudinary: string,
  isSaved: boolean,
  savedAt: Date,
  expiresAt: Date,
  fileHash: string,
  isGuest: boolean,
  _id: string
}

interface ErrorResponse {
  message: string;
}

function SavedDocument() {
  const { user } = useUser()
  const router = useRouter()
  const [document, setDocument] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchDocuments = async () => {
      if (!user) {
        return
      }
      try {
        setLoading(true)
        const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/saved-list`, {})
        setDocument(response.data.data)
      } catch (error) {
        console.error("Error fetching saved documents:", error)
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data.message;
        toast.error(errorMessage || "Failed to load saved documents")
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments();
  }, [user])

  const handleDeleteSubmit = async (documentId: string) => {
    try {
      const response = await api.delete(`${process.env.NEXT_PUBLIC_Backend_Url}/user/delete-save-document`, {
        data: {
          documentId
        }
      })
      setDocument(document.filter(doc => doc._id !== documentId))
      toast.success(response.data.data)
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Failed to delete document")
    }
  }

  const getDaysUntilExpiry = (expiresAt: Date) => {
    const today = new Date()
    const expiry = new Date(expiresAt)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 border-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Saved Documents</span>
            <span className="sm:hidden">Saved</span>
            {document.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 text-xs">
                {document.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className='w-full sm:w-[600px] max-w-[100vw] h-screen flex flex-col overflow-hidden'>
          <SheetHeader className="sr-only">
            <SheetTitle>Saved Documents</SheetTitle>
            <SheetDescription>View and manage your saved legal documents</SheetDescription>
          </SheetHeader>
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Save className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Saved Documents
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manage your saved legal documents
                  </p>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <div className="flex items-start gap-2">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    <strong>Notice:</strong> Documents auto-delete after 14 days
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="ml-3 text-sm text-gray-500">Loading...</span>
              </div>
            ) : document.length > 0 ? (
              <div className="p-4 space-y-3">
                {document.map((doc) => {
                  const daysUntilExpiry = getDaysUntilExpiry(doc.expiresAt)
                  const isExpiringSoon = daysUntilExpiry <= 3

                  return (
                    <Card
                      key={doc._id}
                      className={`transition-all duration-200 hover:shadow-md ${
                        isExpiringSoon 
                          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                          : 'hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {doc.filename}
                            </CardTitle>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                {doc.fileType?.toUpperCase() || 'PDF'}
                              </Badge>
                              {isExpiringSoon && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  Expires in {daysUntilExpiry}d
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="grid grid-cols-2 gap-2 text-xs ml-6">
                          <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                              <Calendar className="w-2.5 h-2.5" />
                              <span>Saved</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(doc.savedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Expires</span>
                            </div>
                            <p className={`font-medium ${
                              isExpiringSoon 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {new Date(doc.expiresAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/document/${doc._id}`)}
                            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 text-xs px-3 py-1.5 h-auto"
                          >
                            <Eye className="w-3 h-3 mr-1.5" />
                            View Document
                          </Button>
                          
                          <Delete onConfirm={() => handleDeleteSubmit(doc._id)} />
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <Save className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  No Saved Documents
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
                  Save important documents from analysis to access them later.
                </p>
                <Button
                  onClick={() => router.push('/upload')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Upload Document
                </Button>
              </div>
            )}
          </div>
          {document.length > 0 && (
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Total: <strong>{document.length}</strong>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Expiring: <strong className="text-red-600 dark:text-red-400">
                    {document.filter(doc => getDaysUntilExpiry(doc.expiresAt) <= 3).length}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SavedDocument
