'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableCell, TableRow } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { ChartColumn, Ellipsis, Save, Settings, TriangleAlert, Upload } from 'lucide-react'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'
import SavedDocument from '@/components/SavedDocument'
import { useUser } from '@/context/UserContext'
import axios from 'axios'
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
  const [document,setDocument] = useState<Document[]>([])
  const router = useRouter();
  const { user } = useUser();  

  useEffect(()=>{
    const fetchDocuments = async ()=>{
      if(!user){
        return
      }
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents`,{
          headers:{
            Authorization: `Bearer ${token}` 
          },
        })
        console.log(response.data.data)
        setDocument(response.data.data)
      } catch (error) {
        
      }
    }
    fetchDocuments();
  },[])
  return (
    <main className='w-full h-full'>
    <div className=' bg-white h-full text-black '>
      <div className=' grid grid-cols-12 '>
      <div className='col-span-12 sm:col-span-9'>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4 ">
        Welcome, {user?.username}
      </h1>
      <h3 className="scroll-m-20 text-xl  tracking-tight pl-3">Your analyzed document at a glance </h3>
      </div>
      <div className='w-full  flex gap-4'>
      <SavedDocument/>
      <p 
      onClick={()=>router.push(`/settings/${user?.username}`)}
      className='p-3 text-black cursor-pointer flex'>Settings<Settings/></p>
      </div>
      </div>
     <div className="grid sm:grid-cols-12 gap-3 p-8 sm:p-4">
      <div className='col-span-3 min-h-[35vh] '>
      <Card className='h-full bg-blue-300 text-black'>
      <CardHeader >
        <Upload  size={100}/>
      <CardTitle className='text-3xl'>Document Uploaded</CardTitle>
      </CardHeader>
      <CardContent className='text-3xl'>{document.length}</CardContent>
      </Card>
      </div>
      <div className='col-span-3 min-h-[35vh] '>
      <Card className='h-full bg-gray-200 text-black'>
      <CardHeader >
        <ChartColumn  size={100}/>
      <CardTitle className='text-3xl'>Total analysis</CardTitle>
      </CardHeader>
      <CardContent className='text-3xl'>5</CardContent>
      </Card>
      </div>
      <div className='col-span-3 min-h-[35vh] '>
      <Card className='h-full bg-gray-200 text-black'>
      <CardHeader >
        <TriangleAlert  size={100}/>
      <CardTitle className='text-3xl'>Risk flag identified</CardTitle>
      </CardHeader>
      <CardContent className='text-3xl'>3</CardContent>
      </Card>
      </div>
      </div>
      <h3 className="scroll-m-20 text-2xl  tracking-tight pl-3 font-semibold">Recent Documents </h3>
      <p className='text-sm text-red-400 pl-3'>Documents present here will be deleted from the date of creation, It is advisable to save the document</p>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 h-full">
  <div className="col-span-12 sm:col-span-9">
    <div className="overflow-x-auto">
      <Table className="min-w-full border-2 border-gray-200 shadow-md rounded-md">
        <thead>
          <TableRow className="font-semibold border border-gray-200 bg-gray-50">
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {document.map((doc) => (
            <TableRow
              key={doc.id}
              onClick={() => router.push(`/document/${doc._id}`)}
              className="border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
            >
              <TableCell>{doc?.filename}</TableCell>
              <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>1.5 MB</TableCell>
              <TableCell>Analyzed</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
</div>

    </div>
    </main>
  )
}

export default page