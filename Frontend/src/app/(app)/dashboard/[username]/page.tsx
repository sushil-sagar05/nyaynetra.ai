'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableCell, TableRow } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { ChartColumn, Ellipsis, Save, TriangleAlert, Upload } from 'lucide-react'
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
    isGuest:Boolean
}
function page() {
  const [document,setDocument] = useState<Document[]>([])
  const router = useRouter();
  // const documentname = 'ravi'
  // const { user } = useUser();  
  // console.log(user)
  useEffect(()=>{
    const fetchDocuments = async ()=>{
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents`,{
          headers:{
            Authorization: `Bearer ${token}` 
          },
        })
        // console.log(response)
        setDocument(response.data.data)
      } catch (error) {
        
      }
    }
    fetchDocuments();
  },[])
  return (
    <div className=' bg-white h-full text-black w-full'>
      <div className=' grid grid-cols-12 '>
      <div className=' col-span-9'>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4 ">
        Welcome, User
      </h1>
      <h3 className="scroll-m-20 text-xl  tracking-tight pl-3">Your analyzed document at a glance </h3>
      </div>
      <SavedDocument/>
      </div>
     <div className="grid grid-cols-12 gap-3 p-4">
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
      <div className=' grid grid-cols-12 gap-3 p-4 h-full'>
        <div className='col-span-9   '>
      <Table className='border-2 border-gray-200 shadow-md  rounded-md'>
        <TableRow className='font-semibold border  border-gray-200'>
          <TableCell>
            Name
          </TableCell>
          <TableCell>
            Date
          </TableCell>
          <TableCell>
            size
          </TableCell>
          <TableCell>
            Status
          </TableCell>
        </TableRow>
        {
          document.map((doc)=>(
          <TableRow
          key={doc.id}
        onClick={()=>router.push(`/document/${doc.filename}`)}
        className='border  border-gray-200'>
          <TableCell>
           {doc?.filename}
          </TableCell>
          <TableCell>
            {new Date(doc.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell>
            1.5 MB
          </TableCell>
          <TableCell>
            Analyzed
          </TableCell>
        </TableRow>
          ))
        }
      
      </Table>
      </div>
      </div>
    </div>
  )
}

export default page