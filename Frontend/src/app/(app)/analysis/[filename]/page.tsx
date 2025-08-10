'use client'
import React, { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SendHorizontal, WrapText, Download, FileText, AlertTriangle, Shield, CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import LoadingModal from '@/components/Loading'

interface ErrorResponse {
  message: string;
}

interface KeyClause {
  chunk_index: number;
  clause_category: string;
  clause_id: string;
  clause_type: string;
  matched_text: string;
  reference_text: string;
  similarity_score: number;
}

interface RiskTerm {
  category: string;
  term: string;
  chunk_index: number;
  confidence: number;
  context: string;
}

function Page() {
  const [activeTab, setActiveTab] = useState("Summary")
  const [isSaved, setIsSaved] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [shortSummary, setShortSummary] = useState('')
  const [riskTerms, setRiskTerms] = useState<RiskTerm[]>([])
  const [keyClauses, setKeyClauses] = useState<KeyClause[]>([])
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const filename = params?.filename

  useEffect(() => {
    if (!filename) return

    const runAnalysis = async () => {
      setLoading(true)
      try {
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_Backend_Url}/analyze/analysis/${filename}`,
          {}
        )
        
        const analysisData = response.data.data
        setShortSummary(analysisData.summary?.short_summary || '')
        setKeyClauses(analysisData.key_clauses || [])
        setRiskTerms(analysisData.risky_terms || [])
        
      } catch (error) {
        console.error('Analysis error:', error)
        toast.error("Failed to fetch analysis.")
        setShortSummary('')
        setKeyClauses([])
        setRiskTerms([])
      } finally {
        setLoading(false)
      }
    }

    runAnalysis()
  }, [filename]) 

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!filename) return

    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_Backend_Url}/user/${filename}/save-document`,
        {}
      )
      toast.success(response.data.data)
      setIsSaved(true)
      setDisabled(true)
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      if (axiosError?.response?.status === 400) {
        setDisabled(true)
        toast.error("Guest is not allowed to save document")
        return
      }
      const errorMessage = axiosError.response?.data.message
      toast.error(errorMessage || "Save failed")
    }
  }
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'liability_risks':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'general':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'financial':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'compliance':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
    }
  }

  const getClauseTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indemnification':
        return <Shield className="w-4 h-4" />
      case 'liability':
        return <AlertTriangle className="w-4 h-4" />
      case 'employment_conditions':
        return <FileText className="w-4 h-4" />
      case 'force_majeure':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (!filename) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>Loading document...</div>
      </main>
    )
  }

  return (
    <>
      {loading && <LoadingModal isOpen={loading}/>}
      <main className='min-h-screen min-w-full'>
        <div className='min-h-screen'>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl pl-6 p-4">
            Unlock Critical Insights: AI Legal Document Analysis in Action
          </h1>
          <Separator className='my-1' />
          <Button disabled={disabled} className='sm:hidden m-2' onClick={handleSubmit}>
            {isSaved ? "Document Saved" : "Save Document"}
          </Button>

          <div className="sm:grid sm:grid-cols-12 overflow-y-auto">
            <div className='hidden sm:block sm:col-span-2'>
              <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} documentId={filename as string} />
            </div>

            <div className='col-span-12 sm:col-span-7'>
              <Card>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="justify-start gap-4 mb-4">
                      <TabsTrigger value="Summary">Summary</TabsTrigger>
                      <TabsTrigger value="Key clause">Key Clauses</TabsTrigger>
                      <TabsTrigger value="Risk flag">Risk Flags</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="Summary" className="mt-0">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold mb-2">Document Summary</h2>
                          <p className="text-gray-600 text-sm sm:text-base">AI-generated analysis and key insights from your legal document.</p>
                        </div>
                        
                        <div className="p-4 sm:p-6 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
                          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Short Summary
                          </h3>
                          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                            {shortSummary || "No short summary available."}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="Key clause" className="mt-0">
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Key Clauses Analysis</h2>
                            <p className="text-gray-600 text-sm sm:text-base mt-1">
                              Important contractual terms and clauses identified in the document with similarity matching.
                            </p>
                          </div>
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {keyClauses.length} {keyClauses.length === 1 ? 'Clause' : 'Clauses'} Found
                          </Badge>
                        </div>
                        
                        {keyClauses.length > 0 ? (
                          <div className="space-y-4">
                            {keyClauses.map((clause, index) => (
                              <Card key={`clause-${clause.clause_id}-${index}`} className="overflow-hidden border-l-4 border-l-blue-500">
                                <CardHeader className="pb-3">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        {getClauseTypeIcon(clause.clause_type)}
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg font-semibold">
                                          {clause.clause_type.replace(/_/g, ' ')}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">Clause ID: {clause.clause_id}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge className={`text-xs px-2 py-1 ${getCategoryColor(clause.clause_category)}`}>
                                        {clause.clause_category.replace(/_/g, ' ')}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs px-2 py-1">
                                        Chunk {clause.chunk_index}
                                      </Badge>
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs px-2 py-1 ${
                                          clause.similarity_score >= 0.8 
                                            ? 'bg-green-100 text-green-800' 
                                            : clause.similarity_score >= 0.7 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {(clause.similarity_score * 100).toFixed(1)}% Match
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                      <FileText className="w-4 h-4 mr-2" />
                                      Document Text
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed italic">
                                      &ldquo;{clause.matched_text}&rdquo;
                                    </p>
                                  </div>
                                  
                                  {/* Reference Clause */}
                                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                      <Shield className="w-4 h-4 mr-2" />
                                      Reference Clause
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {clause.reference_text}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">Similarity Analysis:</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className={`h-2 rounded-full transition-all duration-300 ${
                                            clause.similarity_score >= 0.8 
                                              ? 'bg-green-500' 
                                              : clause.similarity_score >= 0.7 
                                              ? 'bg-yellow-500' 
                                              : 'bg-red-500'
                                          }`}
                                          style={{width: `${clause.similarity_score * 100}%`}}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-semibold">
                                        {(clause.similarity_score * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-gray-400 text-5xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Key Clauses Identified</h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                              The analysis didn&apos;t identify any specific contractual clauses in this document.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="Risk flag" className="mt-0">
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className='text-xl sm:text-2xl font-bold'>Risk Analysis</h2>
                            <p className="text-gray-600 text-sm sm:text-base mt-1">Potential risks and concerns identified in the document.</p>
                          </div>
                          <span className="px-4 py-2 bg-red-100 text-red-800 font-medium rounded-full text-sm whitespace-nowrap">
                            {riskTerms.length} {riskTerms.length === 1 ? 'Risk' : 'Risks'} Detected
                          </span>
                        </div>
                        
                        {riskTerms.length > 0 ? (
                          <div className="space-y-4">
                            {riskTerms.map((risk: RiskTerm, idx: number) => (
                              <div 
                                key={`risk-${risk.term}-${risk.chunk_index}-${idx}`}
                                className="border border-red-200 bg-red-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-3 py-1 bg-red-200 text-red-900 text-xs font-bold rounded-full uppercase tracking-wide">
                                      {risk.category.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-red-700 font-semibold text-base sm:text-lg">
                                      &ldquo;{risk.term}&rdquo;
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 flex flex-col sm:text-right">
                                    <div className="mb-2">Chunk {risk.chunk_index}</div>
                                    <div className="flex items-center gap-2">
                                      <span>Confidence: {(risk.confidence * 100).toFixed(0)}%</span>
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                                          style={{width: `${risk.confidence * 100}%`}}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border-l-4 border-red-400 p-3 sm:p-4 rounded-r">
                                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    <span className="font-medium text-gray-900">Context:</span>
                                    <span className="ml-2 italic">...{risk.context}...</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 border-2 border-dashed border-green-200 rounded-lg">
                            <div className="text-green-600 text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold text-green-800 mb-2">No Significant Risks Detected</h3>
                            <p className="text-green-700 text-sm sm:text-base">This document appears to have minimal risk indicators based on our analysis.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="chat">
                      <Card className="p-4">
                        <CardHeader>
                          <CardTitle className="text-xl">Ask NyayAi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">Chat UI coming soon...</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className='hidden  sm:block sm:col-span-3'>
              <Card className=''>
                <CardTitle className='p-1 flex justify-around'>
                  <span className='flex gap-2'><WrapText />Agreement.pdf</span>
                  <span><Download /></span>
                </CardTitle>
                <CardContent>
                  <ScrollArea className="sm:h-[55vh] rounded-md border p-4">
                  </ScrollArea>
                </CardContent>
                <CardFooter className='gap-2'>
                  <Input className='border-black' />
                  <Button><SendHorizontal /></Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Page
