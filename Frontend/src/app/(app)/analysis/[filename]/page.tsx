'use client'
import React, { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal,WrapText,Download } from 'lucide-react'
import { useParams} from 'next/navigation'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
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
interface riskTerms{
  category:string;
  term:string
}
function Page() {
  const [activeTab, setActiveTab] = useState("Summary")
   const [isSaved, setisSaved] = useState(false)
   const [disabled, setdisabled] = useState(false)
  const [summary, setsummary] = useState([])
  const [shortSummary, setshortSummary] = useState('')
  const [risk_terms, setRisk_terms] = useState<riskTerms[]>([])
  const [key_clauses, setkey_clauses] = useState<KeyClause[]>([]);

  const params = useParams()
  const filename = params?.filename 
  useEffect(() => {
    
  }, [filename]);
  
  if (!filename) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    if (!filename) {
      return
    }
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/${filename}/save-document`,{})
      toast(response.data.data)
      setisSaved(true)
      setdisabled(true)
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if(axiosError.status===400){
        setdisabled(true)
        toast.error("Guest is not allowed to save document")
        return
      }
      const errorMessage= axiosError.response?.data.message;
      toast(errorMessage)
    }
  }
  console.log(filename)

useEffect(() => {
 const Analysis = async()=>{
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/analyze/analysis/${filename}`,{})
      setsummary(response.data.data.summary.actual_summary)
      setshortSummary(response.data.data.summary.short_summary)
      setkey_clauses(response.data.data.key_clauses)
      setRisk_terms(response.data.data.risky_terms[0].risks)

    } catch (error) {
      
    }
  }
  Analysis()
}, [])


  
  return (
    <main className='min-h-screen min-w-full'>
    <div className=' min-h-screen ' >
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-6 p-4 " >Unlock Critical Insights: AI Legal Document Analysis in Action</h1>
      <Separator className='my-1' />
      <Button disabled={disabled}
      className='sm:hidden m-2'
       onClick={(e)=>handleSubmit(e)}
       >{isSaved?"Document Saved":"Save Document"}
      </Button>
      <div className=" sm:grid sm:grid-cols-12 overflow-y-auto ">
        <div className='hidden sm:block sm:col-span-2 '>
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} documentId={filename as string}  />
        </div>
        <div className='col-span-12  overflow-y-auto sm:col-span-7 '>
        <Card >
          <CardContent >
          <Tabs value={activeTab} onValueChange={setActiveTab} >
      <TabsList className=" justify-start gap-4 mb-4">
        <TabsTrigger value="Summary" className='cursor-pointer'>Summary</TabsTrigger>
        <TabsTrigger value="Key clause" className='cursor-pointer'>Key Clauses</TabsTrigger>
        <TabsTrigger value="Risk flag" className='cursor-pointer'>Risk Flags</TabsTrigger>
        <TabsTrigger value="chat" className='cursor-pointer'>Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="Summary">
  <Card className="sm:p-4">
    <CardHeader>
      <CardTitle className="text-xl">Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 w-full">
      <div className="p-4  border rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Short Summary</h2>
        <p className="text-sm ">{shortSummary || "No short summary available."}</p>
      </div>

      <div className="p-4  border rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Detailed Summary</h2>
        <p className="text-sm  whitespace-pre-line">{summary || "No detailed summary available."}</p>
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
      {Array.isArray(key_clauses) && key_clauses.length > 0 ? (
        key_clauses.map((clause, index) => (
          <div key={index} className="p-4 border rounded  shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Preview:</strong> {clause.chunk_preview}
            </p>

            {clause.top_matches && clause.top_matches.length > 0 ? (
              <div className="ml-4 mt-2 space-y-1">
                <h4 className="font-medium">Top Matches:</h4>
                {clause.top_matches.map((match, matchIndex) => (
                  <div key={matchIndex} className="text-sm p-2 border-2 rounded-md  ml-2">
                    <p><strong>Clause:</strong> {match.label}</p>
                    <p><strong>Similarity:</strong> {(match.similarity * 100).toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No clause matches found.</p>
            )}
          </div>
        ))
      ) : (
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
      <h2 className='font-bold'>Detected Risk : {risk_terms.length}</h2>
      {Array.isArray(risk_terms) && risk_terms.length > 0 ? (
        risk_terms.map((risk, idx) => (
          <div
            key={idx}
            className="border p-3 rounded  shadow-sm"
          >
            <p className="text-sm"><strong>Category:</strong> {risk.category}</p>
            <p className="text-sm"><strong>Term:</strong> {risk.term}</p>
          </div>
        ))
      ) : (
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
       <div className='hidden sm:block sm:col-span-3 '>
        <Card className='h-full '>
          <CardTitle className=' p-1 flex justify-around'><span className='flex gap-2'><WrapText/>Agreement.pdf</span><span><Download/></span></CardTitle>
          <CardContent>
          <ScrollArea className="h-[375px]  rounded-md border p-4">
        
        </ScrollArea>
          </CardContent>
          <CardFooter className='gap-2'>
            <Input className='border-black '></Input>
            <Button><SendHorizontal/></Button>
          </CardFooter>
        </Card>
        </div>
      </div>
    <div>

    </div>
    </div>
    </main>
  )
}

export default Page