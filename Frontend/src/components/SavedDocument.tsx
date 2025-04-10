'use client'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import Delete from './Delete'
import axios from 'axios'
function SavedDocument() {

  const router = useRouter()
  const documentname = 'Agreement.pdf'
  useEffect(()=>{
    const fetchDocuments = async ()=>{
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/saved-list`,{},{
          headers:{
            Authorization: `Bearer ${token}` 
          },
        
        })
        console.log(token)
        console.log(response)
      } catch (error) {
        
      }
    }
    fetchDocuments();
  },[])
  return (
    <div>
        <div className='col-span-3 items-center justify-center scroll-auto   '>
        <Sheet >
  <SheetTrigger className=' flex m-5 cursor-pointer'>Saved Documents <Save size={50}/></SheetTrigger>
  <SheetContent className='max-h-screen overflow-y-auto p-1'>
    <SheetHeader>
      <SheetTitle>Your Collection of Saved Documents</SheetTitle>
    </SheetHeader>
  <SheetTitle className='cursor-pointer' onClick={()=>router.push(`/document/${documentname}`)}>Agreement.pdf</SheetTitle>
  <SheetDescription>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel reprehenderit eligendi accusamus molestiae inventore officia omnis qui voluptate nostrum iste, veniam ipsum, officiis fugit obcaecati dolores esse a aut incidunt.
  Eveniet culpa sed nihil sequi ducimus tempora voluptate amet sit autem ab quo dolorem officia pariatur molestiae non ratione voluptas veritatis in natus quia voluptates, ut debitis commodi! Expedita, unde.
  <SheetFooter>
  <Delete onConfirm={() => {
    console.log("Document deleted!")
  }} />
</SheetFooter>
  </SheetDescription>
  <SheetTitle>Agreement.pdf</SheetTitle>
  <SheetDescription>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel reprehenderit eligendi accusamus molestiae inventore officia omnis qui voluptate nostrum iste, veniam ipsum, officiis fugit obcaecati dolores esse a aut incidunt.
  Eveniet culpa sed nihil sequi ducimus tempora voluptate amet sit autem ab quo dolorem officia pariatur molestiae non ratione voluptas veritatis in natus quia voluptates, ut debitis commodi! Expedita, unde.
  <SheetFooter ><Button
  >Delete Document</Button></SheetFooter>
  </SheetDescription>
  <SheetTitle>Agreement.pdf</SheetTitle>
  <SheetDescription>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel reprehenderit eligendi accusamus molestiae inventore officia omnis qui voluptate nostrum iste, veniam ipsum, officiis fugit obcaecati dolores esse a aut incidunt.
  Eveniet culpa sed nihil sequi ducimus tempora voluptate amet sit autem ab quo dolorem officia pariatur molestiae non ratione voluptas veritatis in natus quia voluptates, ut debitis commodi! Expedita, unde.
  <SheetFooter>
  <Delete onConfirm={() => {
    console.log("Document deleted!")
  }} />
</SheetFooter>
  </SheetDescription>
  </SheetContent>
</Sheet>

        </div>
    </div>
  )
}

export default SavedDocument