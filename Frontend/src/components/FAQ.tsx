import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
function FAQ() {
  return (
    <>
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center ">
        Frequently Asked Questions
      </h1>
    <section className='h-full  p-4 flex justify-center mt-4 ' >
      <div className='w-[75vw] h-full  items-center '>
        <div className="inner w-full space-y-6">
        <Accordion className='w-full p-2   rounded-lg shadow-md ' type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger className='text-xl py-4 px-6'>What is Legal Document Analysis?</AccordionTrigger>
    <AccordionContent className='text-lg px-6  py-3'>
    Our platform uses advanced AI to analyze legal documents quickly, extracting key details, clauses, and terms for your review, ensuring you never miss anything important.
    </AccordionContent>
  </AccordionItem>
        </Accordion>
        <Accordion className='w-full p-2   rounded-lg shadow-md ' type="single" collapsible>
  <AccordionItem value="item-2">
    <AccordionTrigger className='text-xl py-4 px-6'>How does the AI work in analyzing documents?</AccordionTrigger>
    <AccordionContent className='text-lg px-6  py-3'>
    The AI uses natural language processing (NLP) and machine learning to identify and categorize critical information within legal documents, such as clauses, terms, dates, and conditions.
    </AccordionContent>
  </AccordionItem>
        </Accordion>
        <Accordion className='w-full p-2   rounded-lg shadow-md ' type="single" collapsible>
  <AccordionItem value="item-3">
    <AccordionTrigger className='text-xl py-4 px-6'>Is my data secure while using the platform?</AccordionTrigger>
    <AccordionContent className='text-lg px-6  py-3'>
      Yes.  Yes, we prioritize security. All documents uploaded to the platform are encrypted both in transit and at rest. Your privacy is guaranteed with secure data storage and access control.
    </AccordionContent>
  </AccordionItem>
        </Accordion>
        <Accordion className='w-full p-2   rounded-lg shadow-md ' type="single" collapsible>
  <AccordionItem value="item-4">
    <AccordionTrigger className='text-xl py-4 px-6'>Do i have to register for using this?</AccordionTrigger>
    <AccordionContent className='text-lg px-6  py-3'>
    We offer two main plans: a **Guest Mode** that allows limited document analysis without saving options and a   **Authenticated users** with unlimited document uploads and storage.
    </AccordionContent>
  </AccordionItem>
        </Accordion>
        </div>
      </div>
      </section>
      </>
  )
}

export default FAQ