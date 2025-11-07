'use client'
import React, { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, AlertTriangle, Shield, CheckCircle, Bot } from 'lucide-react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import LoadingModal from '@/components/Loading'
import { ChatUI } from '@/components/Chat_Ui'
import { useUser } from '../../../../context/UserContext';


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

interface Summary {
  actual_summary?: string;
  short_summary?: string;
  individual_summaries?: string[];
  processing_method?: string;
  time_taken?: string;
}

function Page() {
  const [activeTab, setActiveTab] = useState("Summary")
  const [isSaved, setIsSaved] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [summary, setSummary] = useState<Summary>({})
  const [riskTerms, setRiskTerms] = useState<RiskTerm[]>([])
  const [keyClauses, setKeyClauses] = useState<KeyClause[]>([])
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const filename = params?.filename
  const { user } = useUser();
useEffect(() => {
  if (!filename) return;

  const runAnalysis = async () => {
    setLoading(true);
    try {
      let response;

      if (user) {
        response = await api.get(
          `/analyze/analysis/${filename}`
        );
      } else {
        response = await api.get(
          `${process.env.NEXT_PUBLIC_Backend_Url}/analyze/guest/analysis/${filename}`,
          { withCredentials: false }
        );
      }

      const analysisData = response.data.data;
      setSummary(analysisData.summary || {});
      setKeyClauses(analysisData.key_clauses || []);
      setRiskTerms(analysisData.risky_terms || []);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to fetch analysis.");
      setSummary({});
      setKeyClauses([]);
      setRiskTerms([]);
    } finally {
      setLoading(false);
    }
  };

  runAnalysis();
}, [filename, user]);


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

  const getSummaryContent = () => {
    const shortSummary = summary.short_summary || ''
    const actualSummary = summary.actual_summary || ''
    
    const shortWordCount = shortSummary.trim().split(/\s+/).length
    const threshold = 50
    
    if (shortWordCount < threshold && actualSummary) {
      return (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
              Short Summary
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
              {shortSummary}
            </p>
            <Badge variant="outline" className="text-xs border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
              {shortWordCount} words
            </Badge>
          </div>
          
          <div className="p-4 sm:p-6 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-3"></span>
              Detailed Summary
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {actualSummary}
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="p-4 sm:p-6 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
            Document Summary
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
            {shortSummary || "No summary available."}
          </p>
          {shortSummary && (
            <Badge variant="outline" className="text-xs border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
              {shortWordCount} words
            </Badge>
          )}
        </div>
      )
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
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading document...</div>
      </main>
    )
  }

  return (
    <>
      {loading && <LoadingModal isOpen={loading}/>}
      <main className='min-h-screen min-w-full bg-gray-50 dark:bg-gray-900'>
        <div className='min-h-screen flex flex-col'>
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl pl-6 p-4 text-gray-900 dark:text-white">
              Unlock Critical Insights: AI Legal Document Analysis in Action
            </h1>
            <Separator className='my-1 bg-gray-200 dark:bg-gray-700' />
            <Button 
              disabled={disabled} 
              className='sm:hidden m-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white' 
              onClick={handleSubmit}
            >
              {isSaved ? "Document Saved" : "Save Document"}
            </Button>
          </div>

          <div className="flex-1 min-h-0">
            <div className="sm:grid sm:grid-cols-12 h-full">
              <div className='hidden sm:block sm:col-span-2'>
                <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} documentId={filename as string} />
              </div>
              <div className='col-span-12 sm:col-span-7 h-full'>
                <Card className="h-full flex flex-col border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="flex-1 min-h-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                      <TabsList className="justify-start gap-4 mb-4 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <TabsTrigger 
                          value="Summary"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-600 dark:text-gray-300"
                        >
                          Summary
                        </TabsTrigger>
                        <TabsTrigger 
                          value="Key clause"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-600 dark:text-gray-300"
                        >
                          Key Clauses
                        </TabsTrigger>
                        <TabsTrigger 
                          value="Risk flag"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-600 dark:text-gray-300"
                        >
                          Risk Flags
                        </TabsTrigger>
                        <TabsTrigger 
                          value="chat"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-600 dark:text-gray-300"
                        >
                          Chat
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="flex-1 min-h-0">
                        <TabsContent value="Summary" className="mt-0 h-full">
                          <ScrollArea className="h-full">
                            <div className="space-y-6 pb-4">
                              <div>
                                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">Document Summary</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">AI-generated analysis and key insights from your legal document.</p>
                              </div>
                              
                              {getSummaryContent()}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="Key clause" className="mt-0 h-full">
                          <ScrollArea className="h-full">
                            <div className="space-y-6 pb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Key Clauses Analysis</h2>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                                    Important contractual terms and clauses identified in the document with similarity matching.
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-sm px-3 py-1 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
                                  {keyClauses.length} {keyClauses.length === 1 ? 'Clause' : 'Clauses'} Found
                                </Badge>
                              </div>
                              
                              {keyClauses.length > 0 ? (
                                <div className="space-y-4">
                                  {keyClauses.map((clause, index) => (
                                    <Card key={`clause-${clause.clause_id}-${index}`} className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                      <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-700/50">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                          <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                              {getClauseTypeIcon(clause.clause_type)}
                                            </div>
                                            <div>
                                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {clause.clause_type.replace(/_/g, ' ')}
                                              </CardTitle>
                                              <p className="text-sm text-gray-600 dark:text-gray-400">Clause ID: {clause.clause_id}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Badge className={`text-xs px-2 py-1 ${getCategoryColor(clause.clause_category)}`}>
                                              {clause.clause_category.replace(/_/g, ' ')}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs px-2  py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                              Chunk {clause.chunk_index}
                                            </Badge>
                                            <Badge 
                                              variant="secondary" 
                                              className={`text-xs px-2 py-1 ${
                                                clause.similarity_score >= 0.8 
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                                  : clause.similarity_score >= 0.7 
                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' 
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                              }`}
                                            >
                                              {(clause.similarity_score * 100).toFixed(1)}% Match
                                            </Badge>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      
                                      <CardContent className="space-y-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Document Text
                                          </h4>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                            &ldquo;{clause.matched_text}&rdquo;
                                          </p>
                                        </div>
                                        
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                            <Shield className="w-4 h-4 mr-2" />
                                            Reference Clause
                                          </h4>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {clause.reference_text}
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Similarity Analysis:</span>
                                          <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                              <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                  clause.similarity_score >= 0.8 
                                                    ? 'bg-green-500 dark:bg-green-400' 
                                                    : clause.similarity_score >= 0.7 
                                                    ? 'bg-yellow-500 dark:bg-yellow-400' 
                                                    : 'bg-red-500 dark:bg-red-400'
                                                }`}
                                                style={{width: `${clause.similarity_score * 100}%`}}
                                              ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                              {(clause.similarity_score * 100).toFixed(1)}%
                                            </span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">📋</div>
                                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Key Clauses Identified</h3>
                                  <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
                                    The analysis didn&apos;t identify any specific contractual clauses in this document.
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="Risk flag" className="mt-0 h-full">
                          <ScrollArea className="h-full">
                            <div className="space-y-6 pb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                  <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>Risk Analysis</h2>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">Potential risks and concerns identified in the document.</p>
                                </div>
                                <span className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 font-medium rounded-full text-sm whitespace-nowrap border border-red-200 dark:border-red-800">
                                  {riskTerms.length} {riskTerms.length === 1 ? 'Risk' : 'Risks'} Detected
                                </span>
                              </div>
                              
                              {riskTerms.length > 0 ? (
                                <div className="space-y-4">
                                  {riskTerms.map((risk: RiskTerm, idx: number) => (
                                    <div 
                                      key={`risk-${risk.term}-${risk.chunk_index}-${idx}`}
                                      className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <span className="px-3 py-1 bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-200 text-xs font-bold rounded-full uppercase tracking-wide">
                                            {risk.category.replace(/_/g, ' ')}
                                          </span>
                                          <span className="text-red-700 dark:text-red-300 font-semibold text-base sm:text-lg">
                                            &ldquo;{risk.term}&rdquo;
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:text-right">
                                          <div className="mb-2">Chunk {risk.chunk_index}</div>
                                          <div className="flex items-center gap-2">
                                            <span>Confidence: {(risk.confidence * 100).toFixed(0)}%</span>
                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                              <div 
                                                className="bg-red-500 dark:bg-red-400 h-2 rounded-full transition-all duration-300" 
                                                style={{width: `${risk.confidence * 100}%`}}
                                              ></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="border-l-4 border-red-400 dark:border-red-500 p-3 sm:p-4 rounded-r bg-white dark:bg-gray-800">
                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                          <span className="font-medium text-gray-900 dark:text-white">Context:</span>
                                          <span className="ml-2 italic">...{risk.context}...</span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-16 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                                  <div className="text-green-600 dark:text-green-400 text-5xl mb-4">✅</div>
                                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">No Significant Risks Detected</h3>
                                  <p className="text-green-700 dark:text-green-400 text-sm sm:text-base">This document appears to have minimal risk indicators based on our analysis.</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="chat" className="mt-0 h-full">
                        {user ? (
                        <ChatUI 
                         documentId={filename as string}
                        isAnalysisReady={summary.short_summary !== undefined && !loading}
                       />
                      ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="w-10 h-10 text-blue-500 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Login Required</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to chat with your document.</p>
                     <Button onClick={() => window.location.href = "/login"}>Login</Button>
                    </div>
                    )}
                    </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              <div className='hidden sm:block sm:col-span-3'>
                <Card className='h-full border-0 shadow-lg bg-white dark:bg-gray-800'>
                  <CardHeader className='pb-2 bg-gray-50 dark:bg-gray-700/50'>
                    <CardTitle className='text-lg flex items-center gap-2 text-gray-900 dark:text-white'>
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Quick Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{keyClauses.length}</div>
                        <div className="text-xs text-blue-800 dark:text-blue-300">Key Clauses</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">{riskTerms.length}</div>
                        <div className="text-xs text-red-800 dark:text-red-300">Risk Flags</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Quick Actions</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-start border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={handleSubmit}
                        disabled={disabled}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isSaved ? "Document Saved" : "Save Document"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-start border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => setActiveTab("chat")}
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Ask Questions
                      </Button>
                    </div>
                    {riskTerms.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-red-700 dark:text-red-300">Top Risks</h4>
                        <div className="space-y-1">
                          {riskTerms.slice(0, 3).map((risk, idx) => (
                            <div key={idx} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                              <span className="font-medium text-red-900 dark:text-red-200">&ldquo;{risk.term}&rdquo;</span>
                              <div className="text-red-600 dark:text-red-400">{risk.category.replace(/_/g, ' ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Page
