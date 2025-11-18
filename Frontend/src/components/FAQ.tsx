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
    answer: "Our platform uses advanced AI to analyze legal documents quickly, extracting key details, clauses, and terms for your review, ensuring you never miss anything important. We identify risks, summarize content, and highlight critical sections to streamline your workflow.",
  },
  {
    question: "How does the AI work in analyzing documents?",
    answer: "The AI uses natural language processing (NLP) and machine learning to identify and categorize critical information within legal documents, such as clauses, terms, dates, and conditions. Our models are specifically trained on legal terminology and document structures for maximum accuracy.",
  },
  {
    question: "Is my data secure while using the platform?",
    answer: "Yes. We prioritize security above all. All documents uploaded to the platform are encrypted both in transit and at rest using industry-standard encryption. Your privacy is guaranteed with secure data storage, access control, and we never store your documents permanently without your explicit consent.",
  },
  {
    question: "Do I have to register for using this?",
    answer: "We offer two main plans: a Guest Mode that allows limited document analysis without saving options, and Authenticated users with unlimited document uploads, storage, and advanced features. You can start using our platform immediately without any registration.",

  },
  {
    question: "What file formats are supported?",
    answer: "We support all major document formats including PDF, DOC, DOCX, TXT, and RTF files. Our AI can process documents up to 50MB in size, making it suitable for complex legal documents and contracts.",

  },
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI achieves 95%+ accuracy in identifying key legal clauses and terms. However, we always recommend having a qualified legal professional review the analysis results, as our platform is designed to assist, not replace, professional legal judgment.",

  }
]

function FAQ() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our AI-powered legal document analysis platform
          </p>
          <div className="flex justify-center mt-6">
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Accordion
            className="w-full space-y-4"
            type="single"
            collapsible
          >
            {faqData.map(({ question, answer }, index) => (
              <AccordionItem 
                value={`item-${index}`} 
                key={`faq-${index}`}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900"
              >
                <AccordionTrigger className="text-left px-6 py-5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 group">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors duration-200">
                      {question}
                    </span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 py-5 bg-gray-50 dark:bg-slate-800/50">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-5"></div> 
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQ
