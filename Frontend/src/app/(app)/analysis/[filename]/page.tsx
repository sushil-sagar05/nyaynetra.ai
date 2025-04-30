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
import { useParams,useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

function Page() {
  const [activeTab, setActiveTab] = useState("Summary")
  
  const params = useParams()
  const filename = params?.filename 
  useEffect(() => {
    
  }, [filename]);
  
  if (!filename) {
    return <div>Loading...</div>;
  }
  return (
    <main className='min-h-screen min-w-full'>
    <div className=' min-h-screen ' >
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-6 p-4 " >Unlock Critical Insights: AI Legal Document Analysis in Action</h1>
      <Separator className='my-1' />
      <div className=" sm:grid sm:grid-cols-12 overflow-y-auto ">
        <div className='hidden sm:block sm:col-span-2 '>
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} documentId={filename as string}  />
        </div>
        <div className='col-span-12  overflow-y-auto sm:col-span-7 '>
        <Card >
          <CardContent >
          <Tabs value={activeTab} onValueChange={setActiveTab} >
      <TabsList className=" justify-start gap-4 mb-4">
        <TabsTrigger value="Summary">Summary</TabsTrigger>
        <TabsTrigger value="Key clause">Key Clauses</TabsTrigger>
        <TabsTrigger value="Risk flag">Risk Flags</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="Summary">
        <Card className="sm:p-4 ">
          <CardHeader>
            <CardTitle className="text-xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <ul className="list-disc list-inside space-y-2  ">
              <li>
                This agreement defines the responsibilities of both parties and
                outlines the service-level expectations clearly.
              </li>
              <li>
                It includes termination conditions with a 30-day prior written
                notice clause.
              </li>
              <li>
                Confidentiality and data protection guidelines are strictly laid
                out in section 5.
              </li>
              <li>
                The governing law for dispute resolution is set to Indian
                jurisdiction.
              </li>
            </ul>
            <ul className="list-disc list-inside space-y-2 ">
              <li>
                This agreement defines the responsibilities of both parties and
                outlines the service-level expectations clearly.
              </li>
              <li>
                It includes termination conditions with a 30-day prior written
                notice clause.
              </li>
              <li>
                Confidentiality and data protection guidelines are strictly laid
                out in section 5.
              </li>
              <li>
                The governing law for dispute resolution is set to Indian
                jurisdiction.
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Key clause">
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-xl">Key Clauses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Coming soon…</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Risk flag">
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-xl">Risk Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No major risks detected yet.</p>
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
