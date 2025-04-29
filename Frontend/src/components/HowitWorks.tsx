'use client'
import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent } from '@/components/ui/tabs'
import Image from 'next/image'
import { useIsMobile } from "@/hooks/use-mobile"

import uploadO from '../../public/upload.png'
import AnalysisO from '../../public/analysis.png'
import ReviewO from '../../public/review.png'
import Step4o from '../../public/step4.png'

const items = [
  {
    title: "1 . Upload your Document",
    desc: "Easily upload contracts, agreements, or any legal document for instant analysis.",
    image: uploadO,
    step: "Step 1/4: Upload Document",
  },
  {
    title: "2. Analyze Document",
    desc: "Our powerful AI scans and interprets every section, extracting key clauses and risks.",
    image: AnalysisO,
    step: "Step 2/4: Analyze Document",
  },
  {
    title: "3. Review Document",
    desc: "View a detailed summary, important clauses, obligations, and potential risks highlighted for you.",
    image: ReviewO,
    step: "Step 3/4: Review Document",
  },
  {
    title: "4. Save Document",
    desc: "Save your analysis securely or export reports for quick sharing or future use.",
    image: Step4o,
    step: "Step 4/4: Save Document",
  },
]

function HowitWorks() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState(items[0].title)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = items.findIndex(item => item.title === prev)
        const nextIndex = (currentIndex + 1) % items.length
        return items[nextIndex].title
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center  my-8">
        How it Works
      </h1>
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <Sidebar collapsible={isMobile ? "offcanvas" : "none"} className="w-full ">
              <SidebarContent>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-4 p-4">
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-full">
                          <button
                            onClick={() => setActiveTab(item.title)}
                            className={`
                              flex flex-col items-start w-full text-left rounded-lg transition-all duration-300 
                              ${activeTab === item.title ? 'bg-orange-500 shadow-lg' : ''} 
                              hover:bg-orange-50 p-4
                            `}
                          >
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xl">{item.title}</AccordionTrigger>
                                <AccordionContent className="text-lg">
                                  {item.desc}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarContent>
            </Sidebar>
          </div>
          <div className="md:col-span-7">
            <Tabs value={activeTab} onValueChange={setActiveTab} className=" p-2">
              {items.map((item) => (
                <TabsContent key={item.title} value={item.title} className="rounded-lg border-2 border-black bg-white p-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg w-full h-auto object-cover"
                    layout="responsive"
                  />
                  <h2 className="font-semibold  mt-4">{item.step}</h2>
                </TabsContent>
              ))}
            </Tabs>
          </div>

        </div>
      </section>
    </>
  )
}

export default HowitWorks
