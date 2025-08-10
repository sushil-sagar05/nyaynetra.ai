'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartColumn, Settings, TriangleAlert, Upload, FileText, Calendar, TrendingUp, Activity } from 'lucide-react'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'
import SavedDocument from '@/components/SavedDocument'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import emptyPhoto from '../../../../../public/Empty-bro.png'
import Image from 'next/image'
import api from '@/lib/api'

interface Document {
  id: string
  filename: string
  ClouinaryUrl: string
  createdAt: Date
  fileType: string
  public_id_fromCloudinary: string
  isSaved: boolean
  savedAt: Date
  expiresAt: Date
  fileHash: string
  isGuest: boolean
  _id: string
}

function Page() {
  const [document, setDocument] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, loading } = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents`)
        setDocument(response.data.data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const totalDocuments = document.length
  const totalAnalyses = document.length
  const savedDocuments = document.filter(doc => doc.isSaved).length
  const recentDocuments = document.slice(0, 5) 

  if (loading || isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="text-orange-500">{user?.username}</span>! 
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Your legal document analysis dashboard at a glance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SavedDocument />
              <Button
                onClick={() => router.push(`/settings/${user?.username}`)}
                variant="outline"
                size="lg"
                className="p-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:block ml-2">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Upload className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-70" />
              </div>
              <CardTitle className="text-lg font-semibold">Documents Uploaded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalDocuments}</div>
              <p className="text-orange-100 text-sm">Total files processed</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <ChartColumn className="w-8 h-8" />
                <Activity className="w-5 h-5 opacity-70" />
              </div>
              <CardTitle className="text-lg font-semibold">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalAnalyses}</div>
              <p className="text-blue-100 text-sm">AI-powered reviews</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-teal-500 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-70" />
              </div>
              <CardTitle className="text-lg font-semibold">Saved Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{savedDocuments}</div>
              <p className="text-green-100 text-sm">Stored for 14 Days</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TriangleAlert className="w-8 h-8" />
                <Activity className="w-5 h-5 opacity-70" />
              </div>
              <CardTitle className="text-lg font-semibold">Risk Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-yellow-100 text-sm">Active warnings</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Recent Documents
            </h2>
            {document.length > 0 && (
              <Button
                onClick={() => router.push('/upload')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            )}
          </div>

          {document && document.length > 0 ? (
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Document Library</CardTitle>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Auto-delete in 7 days
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Documents will be automatically deleted after 7 days. Please save important files to keep them permanently.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Document Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Upload Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">File Type</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentDocuments.map((doc) => (
                        <TableRow
                          key={doc._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => router.push(`/document/${doc._id}`)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="truncate max-w-xs">{doc.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-300">
                            {new Date(doc.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="uppercase text-xs">
                              {doc.fileType || 'PDF'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Activity className="w-3 h-3 mr-1" />
                              Analyzed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/document/${doc._id}`);
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {document.length > 5 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/documents')}
                    >
                      View All Documents ({document.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                        You haven't <span className="text-orange-500">uploaded</span> any documents yet!
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                        Get started by uploading your first legal document for AI-powered analysis.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button
                        onClick={() => router.push('/upload')}
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Your First Document
                      </Button>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Instant Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>AI-Powered Insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>100% Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-1 lg:order-2">
                    <div className="relative bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                      <Image
                        className="w-full h-auto max-w-md mx-auto"
                        src={emptyPhoto}
                        alt="No documents uploaded yet"
                        width={400}
                        height={300}
                        priority
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}

export default Page
