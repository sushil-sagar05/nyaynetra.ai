'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { FileDown, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import Delete from '@/components/Delete'

interface ErrorResponse {
  message: string;
}
interface Document{
  id:string
  filename:string,
    ClouinaryUrl:string,
    createdAt:Date;
    fileType:string;
    public_id_fromCloudinary:string,
    isSaved:Boolean,
    savedAt:Date,
    expiresAt:Date,
    fileHash:String,
    isGuest:Boolean,
    _id:string
}
function page() {
      const router = useRouter()
      const params = useParams()
      console.log(params)
      const [document, setdocument] = useState<Document>()

    useEffect(()=>{
      const fetchDocuments = async()=>{
        try {
          const token = localStorage.getItem('token')
          console.log(token)
          const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${params.documentname}`,{
            headers:{
              Authorization: `Bearer ${token}` 
            },
          
          })
          console.log("Document", response.data.data)
          setdocument(response.data.data[0])
        } catch (error) {
          
        }
      }
      fetchDocuments()
    },[params.documentname])



      // console.log(document[0])

    const handleSaveSubmit = async()=>{
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/${params.documentname}/save-document`,{},{
          headers:{
            Authorization: `Bearer ${token}` 
          },
        
        })
        console.log("Document saved:", response.data)
        toast(response.data.data)
      } catch (error) {
        
      }
    }
    const handleDeleteSubmit = async()=>{
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${params.documentname}`,{
          headers:{
            Authorization: `Bearer ${token}` 
          },
        
        })
        toast(response.data.data)
        router.push('/dashboard')
      } catch (error:any) {
        const axiosError = error as AxiosError<ErrorResponse>;
           let errorMessage= axiosError.response?.data.message;
           toast(errorMessage)
      }
    }


  return (
    <div className=' w-full  '>
   <div className=" flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4">
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ">
    Viewing: {document?.filename+'.'+document?.fileType!}
  </h1>
  <div className="flex flex-wrap gap-3  items-center">
    <span className="flex items-center gap-2">
      Share <Share2 />
    </span>
   
      <Button
      className='cursor-pointer'
      onClick={handleSaveSubmit}
      >Save Document <FileDown /></Button>
    
<div className='bg-red-500 rounded-md'>
<Delete
    onConfirm={() => {
        handleDeleteSubmit();
    }}
    />
</div>
  </div>
</div>


      <div className='grid grid-cols-12 p-5 gap-3'>
        <div className=' col-span-12 sm:col-span-3 h-[45vh] '>
            <Card className='h-full'>
                <CardTitle className='text-center'>{document?.filename!}</CardTitle>
                <CardContent>
                 <CardDescription>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit, sapiente dicta! Obcaecati distinctio quisquam fugit voluptatem, exercitationem sint et quia, ut praesentium possimus in cumque dicta magnam dignissimos, repellat amet.
                 </CardDescription>
                </CardContent>
                <CardFooter>
                  <p className='w-full'>Status: Analysed</p>
                <p >Created At: {new Date(document?.createdAt!).toLocaleDateString()}</p>
                </CardFooter>
            </Card>
           
        </div>
        <div className='col-span-12 sm:col-span-9  '>
      <Card className='h-full w-full   '>
          <CardContent className=''>
          <Tabs  className="w-full">
      <TabsList defaultValue={'Summary'} className="w-full justify-start gap-4 mb-4 space-x-4 ">
        <TabsTrigger value="Summary">Summary</TabsTrigger>
        <TabsTrigger value="Key clause">Key Clauses</TabsTrigger>
        <TabsTrigger value="Risk flag">Risk Flags</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="Summary">
        <Card className="p-4 ">
          <CardHeader>
            <CardTitle className="text-xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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
      </div>
    </div>
  )
}

export default page
