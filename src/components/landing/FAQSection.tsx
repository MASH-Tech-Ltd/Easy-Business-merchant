'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "What is masheco?",
    answer: "MASH ECO is a comprehensive multi-tenant e-commerce platform specifically optimized for merchants to launch, manage, and scale their online business."
  },
  {
    question: "How many products can I upload?",
    answer: "Our plans are designed to scale perfectly with your business. Depending on the tier you choose, you can easily upload and manage anywhere from 1 up to 1500 products. You always have the flexibility to upgrade your plan at any time as your inventory grows."
  },
  {
    question: "What addons are available for my store?",
    answer: "We offer a suite of powerful addons built directly into your dashboard to help automate and secure your business. You can instantly enable tools like Abandoned Checkout Recovery to boost sales, automated Fraud Checks for secure payments, instant SMS Notifications for your customers, and full Courier Automation for seamless shipping."
  },
  {
    question: "Do you offer yearly billing?",
    answer: "Yes! All of our packages (Basic, Standard, Premium) have discounted yearly billing options available in your dashboard."
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
    <section id="faq" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-500">
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
                className="w-full px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center bg-white focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className={`font-semibold text-left text-sm sm:text-base ${openIndex === index ? 'text-[hsl(var(--accent-primary))]' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[hsl(var(--accent-primary))]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <div 
                className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-4 sm:pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
