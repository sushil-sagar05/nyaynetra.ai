'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableRow } from '@/components/ui/table'
import { ChartColumn, Settings, TriangleAlert, Upload } from 'lucide-react'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'
import SavedDocument from '@/components/SavedDocument'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'
import emptyPhoto from '../../../../../public/Empty-bro.png'
import Image from 'next/image'
import api from '@/lib/api'

interface Document {
  id: string
  filename: string
  ClouinaryUrl: string
  createdAt: Date
  fileType: string
  public_id_fromCloudinary: string
  isSaved: boolean
  savedAt: Date
  expiresAt: Date
  fileHash: string
  isGuest: boolean
  _id: string
}

function Page() {
  const [document, setDocument] = useState<Document[]>([])
  const router = useRouter()

  const { user, loading } = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents`)
        setDocument(response.data.data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      }
    }
    fetchDocuments()
  }, [user])

  return (
    <main className="w-full min-h-screen ">
      <section className="p-6 sm:p-8">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 sm:col-span-9">
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
              Hello, <span className="text-orange-500">{user?.username}</span>
            </h1>
            <h3 className="text-xl tracking-tight mt-2">
              Your analyzed document at a glance
            </h3>
          </div>
          <div className="col-span-12 sm:col-span-3 flex flex-wrap gap-4 justify-end">
            <SavedDocument />
            <Button
              onClick={() => router.push(`/settings/${user?.username}`)}
              className="p-3 gap-2  flex items-center rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
            >
              <Settings />
            </Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-12 gap-4 p-6 sm:p-8">
        <div className="col-span-12 sm:col-span-4">
          <Card className="h-full bg-orange-500 ">
            <CardHeader>
              <Upload size={80} />
              <CardTitle className="text-2xl sm:text-3xl mt-2">Documents Uploaded</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">{document.length}</CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-4">
          <Card className="h-full  ">
            <CardHeader>
              <ChartColumn size={80} />
              <CardTitle className="text-2xl sm:text-3xl mt-2">Total Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">0</CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-4">
          <Card className="h-full  ">
            <CardHeader>
              <TriangleAlert size={80} />
              <CardTitle className="text-2xl sm:text-3xl mt-2">Risk Flags</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">0</CardContent>
          </Card>
        </div>
      </section>
      <section className="p-6 sm:p-8">
        <h3 className="text-2xl font-semibold mb-4">Recent Documents</h3>

        {document && document.length > 0 ? (
          <>
            <p className="text-sm text-red-400 mb-4">
              Documents will be auto-deleted after 7 days. Please save important files.
            </p>
            <div className="overflow-x-auto">
              <Table className="min-w-full border-2 border-gray-200 shadow-md rounded-md">
                <thead>
                  <TableRow className="font-semibold border border-gray-200 ">
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
                      className="border border-gray-200 cursor-pointer  transition"
                    >
                      <TableCell>{doc.filename}</TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>1.5 MB</TableCell>
                      <TableCell>Analyzed</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-8 mt-8">
            <div className="col-span-12 md:col-span-6">
              <Image
                className="h-full w-full object-cover rounded-lg"
                src={emptyPhoto}
                alt="Empty State"
                layout="responsive"
              />
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl font-semibold text-gray-800 tracking-tight leading-tight md:text-5xl lg:text-6xl">
                You have not <span className="text-orange-500">Uploaded</span> any Documents yet!!
              </h1>
              <div className="mt-6 w-full px-6">
                <Button
                  onClick={() => router.push('/upload')}
                  className="bg-orange-500 text-white w-full cursor-pointer hover:bg-orange-600"
                >
                  Upload Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Page
