import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { FileDown, Share2 } from 'lucide-react'
import React from 'react'

function page() {
  return (
    <div className='h-full w-full  bg-white'>
     <div className='h-[8vh]  flex justify-around items-center'>
     <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4 text-black ">
     Viewing: [Document Name]
      </h1>
      <div>
      <div className='col-span-2 text-black gap-3 mt-4 flex '>
               <span className='flex gap-2'>share <Share2/></span>
               <span className='flex gap-2'>Save Document <FileDown/></span>
               <Button>Delete Document</Button>
               </div>
      </div>
     </div>

      <div className='grid grid-cols-12 p-5 gap-3'>
        <div className='col-span-3 h-[45vh] '>
            <Card className='h-full'>
                <CardTitle className='text-center'>Document.pdf</CardTitle>
                <CardContent>

                </CardContent>
                <CardFooter>
                
                </CardFooter>
            </Card>
           
        </div>
        <div className='col-span-9  '>
      <Card className='h-full w-full  text-white '>
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
{/* <div className='col-span-2  p-3 min-h-[100px]'>
               <span className='flex gap-2'>share <Share2/></span>
               <span className=''>Save Document <Switch/></span>
               <Button>Delete Document</Button>
               </div> */}