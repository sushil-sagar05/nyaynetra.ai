import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is Legal Document Analysis?",
    answer: "Our platform uses advanced AI to analyze legal documents quickly, extracting key details, clauses, and terms for your review, ensuring you never miss anything important."
  },
  {
    question: "How does the AI work in analyzing documents?",
    answer: "The AI uses natural language processing (NLP) and machine learning to identify and categorize critical information within legal documents, such as clauses, terms, dates, and conditions."
  },
  {
    question: "Is my data secure while using the platform?",
    answer: "Yes. We prioritize security. All documents uploaded to the platform are encrypted both in transit and at rest. Your privacy is guaranteed with secure data storage and access control."
  },
  {
    question: "Do I have to register for using this?",
    answer: "We offer two main plans: a Guest Mode that allows limited document analysis without saving options and Authenticated users with unlimited document uploads and storage."
  }
]

function FAQ() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center mb-8 ">
        Frequently Asked Questions
      </h1>
      <section className="h-full p-4 flex justify-center mt-4">
        <div className="w-[75vw] h-full">
          <Accordion
            className="w-full p-4 rounded-lg shadow-md "
            type="single"
            collapsible
          >
            {faqData.map(({ question, answer }, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger
                  className="text-xl py-4 px-6  hover:text-orange-500 data-[state=open]:text-orange-500"
                  style={{ borderBottom: '2px solid transparent', transition: 'border-color 0.3s ease' }}
                >
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-lg px-6 py-3 ">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}

export default FAQ
