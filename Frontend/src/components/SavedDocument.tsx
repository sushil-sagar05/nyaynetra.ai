'use client'
import { Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from 'next/navigation'
import Delete from './Delete'
import  { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useUser } from '@/context/UserContext'
import api from '@/lib/api'
interface Document{
  id:string
  filename:string,
    ClouinaryUrl:string,
    createdAt:Date;
    fileType:string;
    public_id_fromCloudinary:string,
    isSaved:boolean,
    savedAt:Date,
    expiresAt:Date,
    fileHash:string,
    isGuest:Boolean,
    _id:string
}
interface ErrorResponse {
  message: string;
}
function SavedDocument() {
  const {user} = useUser()
  const router = useRouter()
  const [document,setDocument] = useState<Document[]>([])
  useEffect(()=>{
    if(!user){
      return
    }
    const fetchDocuments = async ()=>{
      if(!user){
        return
      }
      try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/saved-list`,{})
        setDocument(response.data.data)
      } catch (error) {
        console.error("Error in signup of User ",error)
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage= axiosError.response?.data.message;
        toast(errorMessage)
      }
    }
    fetchDocuments();
  },[user])


  const handleDeleteSubmit = async(documentId:string)=>{
    try {
      const response = await api.delete(`${process.env.NEXT_PUBLIC_Backend_Url}/user/delete-save-document`,{
        data:{
          documentId
        }
      
      })
      setDocument(document.filter(doc=>doc._id!=documentId))
      toast(response.data.data)
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage= axiosError.response?.data.message;
      toast(errorMessage)
    }
  }
  return (
    <div>
        <div className='col-span-3 items-center justify-center scroll-auto   '>
        <Sheet >
  <SheetTrigger className=' flex m-5 cursor-pointer'>Saved Documents <Save size={50}/></SheetTrigger>
  <SheetContent className='max-h-screen overflow-y-auto p-1'>
    <SheetHeader>
      <SheetTitle>Your Collection of Saved Documents</SheetTitle>
      <SheetTitle className='text-red-400'>Document present in Saved List will be deleted from 14 days to the date of save</SheetTitle>
    </SheetHeader>
 {
 document.map((doc)=>(
  <>
  <SheetTitle
  onClick={()=>router.push(`/document/${doc._id}`)}
  className=' cursor-pointer p-2'>Document Name : {doc.filename}</SheetTitle>
  <SheetDescription className='p-2'>
    <p>File Type: {doc.fileType}</p>
    <p>SavedAt: {new Date(doc.savedAt).toLocaleDateString()}</p>
    <p>ExpiresAt: {new Date(doc.expiresAt).toLocaleDateString()}</p>
  <SheetFooter>
  <Delete
  onConfirm={() => {
    handleDeleteSubmit(doc._id);
  }} />
</SheetFooter>
  </SheetDescription>
  </>
 ))
 }
  
  
  </SheetContent>
</Sheet>

        </div>
    </div>
  )
}

export default SavedDocument
