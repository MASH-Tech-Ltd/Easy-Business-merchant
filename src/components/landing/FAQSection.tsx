'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is MashEasy?",
    answer: "MashEasy is a comprehensive multi-tenant e-commerce platform specifically optimized for electronics merchants to launch, manage, and scale their online business."
  },
  {
    question: "How many products can I upload?",
    answer: "Our plans are designed to scale with you: Free Plan (50 products), Basic (100 products), Premium (200 products), and Enterprise (up to 500 products)."
  },
  {
    question: "What addons are available for my store?",
    answer: "We offer powerful addons through our dashboard including Abandoned Checkout recovery (9.99), Fraud Check (19.99), SMS Notifications (14.99), and Courier Automation (39.99)."
  },
  {
    question: "Do you offer yearly billing?",
    answer: "Yes! All of our packages (Basic, Premium, Enterprise) have discounted yearly billing options available in your dashboard."
  },
  {
    question: "Can I track my store's performance?",
    answer: "Absolutely. We offer an Advanced Analytics addon that provides a deep dive into your store's performance with custom reports."
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
