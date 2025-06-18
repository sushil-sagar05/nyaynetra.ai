'use client'
import React, { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal, WrapText, Download } from 'lucide-react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import LoadingModal from '@/components/Loading'

interface ErrorResponse {
  message: string;
}

interface TopMatch {
  label: string;
  similarity: number;
}

interface KeyClause {
  chunk_index: number;
  chunk_preview: string;
  top_matches: TopMatch[];
}

interface RiskTerm {
  category: string;
  term: string;
}
function Page() {
  const [activeTab, setActiveTab] = useState("Summary")
  const [isSaved, setIsSaved] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [summary, setSummary] = useState<string[]>([])
  const [shortSummary, setShortSummary] = useState('')
  const [riskTerms, setRiskTerms] = useState<RiskTerm[]>([])
  const [keyClauses, setKeyClauses] = useState<KeyClause[]>([])
  const [loading,setLoading] = useState(false)
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
        setSummary(response.data.data.summary.actual_summary)
        setShortSummary(response.data.data.summary.short_summary)
        setKeyClauses(response.data.data.key_clauses)
        setRiskTerms(response.data.data.risky_terms[0].risks)
        setLoading(false)
      } catch {
        toast.error("Failed to fetch analysis.")
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
                  <TabsContent value="Summary">
                    <Card className="sm:p-4">
                      <CardHeader>
                        <CardTitle className="text-xl">Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 w-full">
                        <div className="p-4 border rounded shadow-sm">
                          <h2 className="text-lg font-semibold mb-2">Short Summary</h2>
                          <p className="text-sm">{shortSummary || "No short summary available."}</p>
                        </div>
                        <div className="p-4 border rounded shadow-sm">
                          <h2 className="text-lg font-semibold mb-2">Detailed Summary</h2>
                          <p className="text-sm whitespace-pre-line">{summary || "No detailed summary available."}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="Key clause">
                    <Card className="p-4">
                      <CardHeader>
                        <CardTitle className="text-xl">Key Clauses</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {keyClauses.length > 0 ? keyClauses.map((clause, index) => (
                          <div key={index} className="p-4 border rounded shadow-sm">
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Preview:</strong> {clause.chunk_preview}
                            </p>
                            {clause.top_matches?.length > 0 ? (
                              <div className="ml-4 mt-2 space-y-1">
                                <h4 className="font-medium">Top Matches:</h4>
                                {clause.top_matches.map((match, matchIndex) => (
                                  <div key={matchIndex} className="text-sm p-2 border-2 rounded-md ml-2">
                                    <p><strong>Clause:</strong> {match.label}</p>
                                    <p><strong>Similarity:</strong> {(match.similarity * 100).toFixed(2)}%</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No clause matches found.</p>
                            )}
                          </div>
                        )) : (
                          <p className="text-gray-500">No key clauses identified.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="Risk flag">
                    <Card className="p-4">
                      <CardHeader>
                        <CardTitle className="text-xl">Risk Flags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <h2 className='font-bold'>Detected Risk: {riskTerms.length}</h2>
                        {riskTerms.length > 0 ? riskTerms.map((risk, idx) => (
                          <div key={idx} className="border p-3 rounded shadow-sm">
                            <p className="text-sm"><strong>Category:</strong> {risk.category}</p>
                            <p className="text-sm"><strong>Term:</strong> {risk.term}</p>
                          </div>
                        )) : (
                          <p className="text-muted-foreground italic">No major risks detected yet.</p>
                        )}
                      </CardContent>
                    </Card>
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

          <div className='hidden sm:block sm:col-span-3'>
            <Card className='h-full'>
              <CardTitle className='p-1 flex justify-around'>
                <span className='flex gap-2'><WrapText />Agreement.pdf</span>
                <span><Download /></span>
              </CardTitle>
              <CardContent>
                <ScrollArea className="h-[375px] rounded-md border p-4">
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
