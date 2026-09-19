'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is MashEasy?",
    answer: "MashEasy is a comprehensive multi-tenant e-commerce platform designed to help you launch, manage, and scale your online business without any coding knowledge."
  },
  {
    question: "How do I add my shop to MashEasy?",
    answer: "Simply click the 'Become a Merchant' button, fill in your details, and follow the simple setup wizard. Your store can be live in less than 10 minutes."
  },
  {
    question: "Why should I choose MashEasy over others?",
    answer: "We provide an all-in-one solution that includes authentic seller verification, integrated logistics for easy returns, and a premium collection of responsive themes, all managed from a single easy-to-use dashboard."
  },
  {
    question: "What payment methods are available?",
    answer: "MashEasy integrates with major payment gateways including Stripe, PayPal, and local mobile banking options, ensuring you can accept payments globally and locally."
  },
  {
    question: "Is there any limit to the products I can upload?",
    answer: "No, our premium plans offer unlimited product listings. You can scale your inventory as much as you need."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Have a question? We're here to help.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-md border-[hsl(var(--accent-primary))]/30' : 'hover:border-gray-300'}`}
            >
              <button
                className="w-full px-6 py-5 flex justify-between items-center bg-white focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className={`font-semibold text-left ${openIndex === index ? 'text-[hsl(var(--accent-primary))]' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[hsl(var(--accent-primary))]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
