'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, ArrowLeft, Info, Calendar, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Delete from '@/components/Delete';

interface ErrorResponse {
  message: string;
}

interface Document {
  id: string;
  filename: string;
  ClouinaryUrl: string;
  createdAt: Date;
  fileType: string;
  public_id_fromCloudinary: string;
  isSaved: boolean;
  savedAt: Date;
  expiresAt: Date;
  fileHash: string;
  isGuest: boolean;
  _id: string;
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
  const router = useRouter();
  const { documentname } = useParams();
  const { user, loading } = useUser();

  const [document, setDocument] = useState<Document | null>(null);
  const [summary, setSummary] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [keyClauses, setKeyClauses] = useState<KeyClause[]>([]);
  const [riskTerms, setRiskTerms] = useState<RiskTerm[]>([]);
  const [activeTab, setActiveTab] = useState('Summary');
  const [isSaved, setIsSaved] = useState(false);
  const [disableSave, setDisableSave] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDocAndAnalysis = async () => {
      try {
        const docRes = await api.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${documentname}`);
        const fetchedDoc = docRes.data.data[0];
        setDocument(fetchedDoc);
        
        const analysisRes = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/analyze/get-analyzed-document/${documentname}`);
        const { summary, risky_terms, key_clauses } = analysisRes.data.data;
        
        setSummary(summary?.actual_summary || '');
        setShortSummary(summary?.short_summary || '');
        setRiskTerms(risky_terms || []); 
        setKeyClauses(key_clauses || []);
        
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const msg = axiosError.response?.data.message || "Failed to load document";
        toast.error(msg);
        setSummary('');
        setShortSummary('');
        setRiskTerms([]);
        setKeyClauses([]);
      }
    };

    if (documentname) {
      fetchDocAndAnalysis();
    }
  }, [documentname]);

  const handleSaveSubmit = async () => {
    try {
      const res = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/${documentname}/save-document`, {});
      toast.success(res.data.data);
      setIsSaved(true);
      setDisableSave(true);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 400) {
        toast.error("Guest is not allowed to save document");
      } else {
        toast.error(axiosError.response?.data.message || "Save failed");
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const res = await api.delete(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${documentname}`);
      if (res.data.data.result === "ok") {
        toast.success(res.data.message);
        router.push(`/dashboard/${user?.username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Delete failed");
    }
  };
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

  return (
    <main className='min-h-screen w-full bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6'>
          <div className="flex items-center gap-3 mb-4 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Document Analysis</span>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <h1 className='text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight'>
                {document ? `${document.filename}.${document.fileType}` : "Loading..."}
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>Legal Document Analysis</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                onClick={handleSaveSubmit} 
                disabled={disableSave}
                size="sm"
                className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm'
              >
                {isSaved ? "Saved" : "Save"} 
                <FileDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Delete onConfirm={handleDeleteSubmit} />
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6'>
          <div className='lg:col-span-3 order-2 lg:order-1'>
            <div className="lg:sticky lg:top-6">
              <div className="lg:hidden mb-4">
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Document Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                          Analyzed
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {document?.createdAt ? new Date(document.createdAt).toLocaleDateString() : "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FileText className="w-3 h-3" />
                        <span className="text-xs font-medium">{document?.fileType?.toUpperCase() || "PDF"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="hidden lg:block">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {document?.filename ?? "Untitled Document"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                        Analyzed
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {document?.createdAt ? new Date(document.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {document?.fileType?.toUpperCase() || "PDF"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className='lg:col-span-9 order-1 lg:order-2'>
            <Card className="min-h-[500px] border-0 shadow-lg">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4">
                    <TabsList className="grid w-full grid-cols-4 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <TabsTrigger 
                        value="Summary" 
                        className='text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
                      >
                        Summary
                      </TabsTrigger>
                      <TabsTrigger 
                        value="Key clause" 
                        className='text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
                      >
                        <span className="hidden sm:inline">Key </span>Clauses
                      </TabsTrigger>
                      <TabsTrigger 
                        value="Risk flag" 
                        className='text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
                      >
                        <span className="hidden sm:inline">Risk </span>Flags
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat" 
                        className='text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
                      >
                        Chat
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-3 sm:p-6">
                    <TabsContent value="Summary" className="mt-0">
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                            Document Summary
                          </h2>
                        </div>
                        
                        <div className="p-4 sm:p-6 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center text-sm sm:text-base">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Short Summary
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            {shortSummary || "No short summary available."}
                          </p>
                        </div>
                        
                        <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm sm:text-base">
                            <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                            Detailed Summary
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {summary || "No detailed summary available."}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="Key clause" className="mt-0">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                              Key Clauses Analysis
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                                        <CardTitle className="text-base sm:text-lg font-semibold">
                                          {clause.clause_type.replace(/_/g, ' ')}
                                        </CardTitle>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                          Clause ID: {clause.clause_id}
                                        </p>
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
                                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center text-sm">
                                      <FileText className="w-3 h-3 mr-2" />
                                      Document Text
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                      &ldquo;{clause.matched_text}&rdquo;
                                    </p>
                                  </div>
                                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-sm">
                                      <Shield className="w-3 h-3 mr-2" />
                                      Reference Clause
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {clause.reference_text}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Similarity Analysis:
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                                      <span className="text-xs sm:text-sm font-semibold">
                                        {(clause.similarity_score * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="text-gray-400 text-3xl sm:text-4xl mb-4">📋</div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              No Key Clauses Identified
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              The analysis didn&apos;t identify any specific contractual clauses in this document.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="Risk flag" className="mt-0">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>Risk Analysis</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Potential risks and concerns identified in the document.
                            </p>
                          </div>
                          <span className="inline-flex items-center px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 font-medium rounded-full text-sm whitespace-nowrap">
                            {riskTerms.length} {riskTerms.length === 1 ? 'Risk' : 'Risks'} Detected
                          </span>
                        </div>
                        
                        {riskTerms.length > 0 ? (
                          <div className="space-y-3 sm:space-y-4">
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
                                    <span className="text-red-700 dark:text-red-300 font-semibold text-sm sm:text-lg break-words">
                                      &ldquo;{risk.term}&rdquo;
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex flex-row sm:flex-col sm:text-right gap-4 sm:gap-1">
                                    <div>Chunk {risk.chunk_index}</div>
                                    <div className="flex items-center gap-2">
                                      <span>Confidence: {(risk.confidence * 100).toFixed(0)}%</span>
                                      <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                                          style={{width: `${risk.confidence * 100}%`}}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 border-l-4 border-red-400 p-3 sm:p-4 rounded-r">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <span className="font-medium text-gray-900 dark:text-white">Context:</span>
                                    <span className="ml-2 italic break-words">...{risk.context}...</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 sm:py-16 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-dashed border-green-200 dark:border-green-800">
                            <div className="text-green-600 dark:text-green-400 text-4xl sm:text-5xl mb-4">✅</div>
                            <h3 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                              No Significant Risks Detected
                            </h3>
                            <p className="text-sm sm:text-base text-green-700 dark:text-green-400">
                              This document appears to have minimal risk indicators based on our analysis.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="chat" className="mt-0">
                      <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-gray-400 text-4xl sm:text-5xl mb-4">💬</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Chat Feature Coming Soon
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                          Interactive document Q&A will be available in the next update.
                        </p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
