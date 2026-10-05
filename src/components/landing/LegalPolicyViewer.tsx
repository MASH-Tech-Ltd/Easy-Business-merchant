'use client';

import { useState } from 'react';

interface LegalPolicyViewerProps {
  policyType: 'privacy-policy' | 'terms-of-service' | 'cookie-policy';
}

export default function LegalPolicyViewer({ policyType }: LegalPolicyViewerProps) {
  const [lang, setLang] = useState<'bn' | 'en'>('en');

  return (
    <div className="space-y-6 text-left text-gray-700 w-full max-w-5xl mx-auto">
      {/* Compact Language Toggle in Top Right Corner */}
      <div className="flex justify-end -mt-6 mb-4">
        <div className="inline-flex items-center p-1 bg-gray-100/90 border border-gray-200 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => setLang('bn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              lang === 'bn'
                ? 'bg-[hsl(var(--accent-primary))] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <span>🇧🇩</span> বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              lang === 'en'
                ? 'bg-[hsl(var(--accent-primary))] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <span>🌐</span> English
          </button>
        </div>
      </div>

      {/* Policy Content */}
      {policyType === 'privacy-policy' && (
        lang === 'bn' ? (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              MASH ECO ("আমরা", "আমাদের") প্ল্যাটফর্মের সকল মার্চেন্ট, স্টোর মালিক এবং ভিজিটরদের তথ্যের গোপনীয়তা, নিরাপত্তা এবং সঠিক সুরক্ষা দিতে প্রতিশ্রুতিবদ্ধ। এই প্রাইভেসি পলিসিতে ব্যাখ্যা করা হয়েছে আমরা কীভাবে আমাদের মাল্টি-টেন্যান্ট SaaS প্ল্যাটফর্ম ও মার্চেন্ট ড্যাশবোর্ড সেবায় আপনার তথ্য সংগ্রহ, প্রক্রিয়া ও সংরক্ষণ করি।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ১. আমরা যেসব তথ্য সংগ্রহ করি
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>মার্চেন্ট ও অ্যাকাউন্ট পরিচিতি:</strong> মার্চেন্ট অ্যাকাউন্ট নিবন্ধনের সময় আপনার নাম, ব্যবসার নাম, ফোন নম্বর, ইমেইল ঠিকানা ও স্টোরের সাবডোমেন/কাস্টম ডোমেন বিবরণ।
              </li>
              <li>
                <strong>স্টোর ব্যবস্থাপনা ও স্টোরফ্রন্ট অবস্থা:</strong> আপনার স্টোর কনফিগারেশন, থিম পছন্দ, ডোমেন ম্যাপিং সেটিংস এবং স্টোর মোড (অনলাইন/অফলাইন স্টেটাস)।
              </li>
              <li>
                <strong>অর্ডার ও ক্রেতার লেনদেন ডেটা:</strong> আপনার স্টোরে দেওয়া অর্ডার সংক্রান্ত তথ্য, যেমন ক্রেতার ডেলিভারির বিবরণ, পণ্যের বিবরণ, পেমেন্ট স্টেটাস এবং পার্সেল ট্র্যাকিং সংক্রান্ত তথ্য।
              </li>
              <li>
                <strong>সিকিউরিটি ও সেশন মনিটরিং:</strong> সেশন ও ব্রাউজার সিকিউরিটি এনফোর্সমেন্টের মাধ্যমে অ্যাকাউন্টের নিরাপত্তা সুনিশ্চিত করা।
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. আমরা কীভাবে আপনার তথ্য ব্যবহার করি
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>আপনার ই-কমার্স স্টোর এবং মার্চেন্ট ড্যাশবোর্ড নিরাপদে পরিচালনা করা।</li>
              <li>সাবস্ক্রিপশন প্ল্যান, প্রোডাক্ট লিমিট এবং অটোমেটেড বিলিং পরিচালনা করা।</li>
              <li>বিল্ট-ইন অ্যানালিটিক্স, অর্ডার ট্র্যাকিং এবং স্বয়ংক্রিয় কুরিয়ার লজিস্টিকস সার্ভিস নিশ্চিত করা।</li>
              <li>জালিয়াতি প্রতিরোধ এবং প্ল্যাটফর্মের নিরাপত্তা বজায় রাখা।</li>
              <li>অ্যাকাউন্ট সিকিউরিটি ও প্ল্যাটফর্ম নীতি বজায় রেখে অ্যাকাউন্ট স্টেটাস (Active, Inactive, Pending, Suspended, Banned) ব্যবস্থাপনা করা।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৩. তথ্য আদান-প্রদান ও তৃতীয় পক্ষ
            </h2>
            <p className="leading-relaxed">
              আমরা আপনার কোনো ব্যক্তিগত বা বাণিজ্যিক তথ্য বিক্রি করি না। সার্ভিস প্রদানের প্রয়োজনে বিশ্বস্ত পার্টনারদের সাথে প্রয়োজনীয় তথ্য শেয়ার করা হয়:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>কুরিয়ার ও লজিস্টিকস পার্টনার:</strong> স্বয়ংক্রিয় পার্সেল শিপিং ও ডেলিভারি ট্র্যাকিংয়ের জন্য।</li>
              <li><strong>পেমেন্ট গেটওয়ে:</strong> কাস্টমার চেকআউট ও বিলিং লেনদেন সম্পূর্ণ করার জন্য।</li>
              <li><strong>ইনফ্রাস্ট্রাকচার ও সিকিউরিটি সেবা:</strong> ক্লাউড সার্ভার ও হাই-অ্যাভেলেবিলিটি হোস্টিন সার্ভিস।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৪. ডেটা সুরক্ষা ও নিরাপত্তা
            </h2>
            <p className="leading-relaxed">
              আমরা আধুনিক শিল্প-মানের এনক্রিপশন ও সিকিউরিটি প্রযুক্তি ব্যবহার করি। আপনার অ্যাকাউন্ট পাসওয়ার্ড এবং সিকিউরিটি কি-এর গোপনীয়তা বজায় রাখা আপনার দায়িত্ব।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">Last Updated: October 2026</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              MASH ECO ("we", "us", or "our") is committed to protecting the privacy, security, and data integrity of all merchants, store owners, and platform visitors. This Privacy Policy explains how we collect, process, disclose, and safeguard your information when you utilize our multi-tenant SaaS platform, merchant dashboard, and administrative services.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Merchant & Account Identity:</strong> When you register for a merchant account, we collect your name, business name, phone number, email address, and store domain details.
              </li>
              <li>
                <strong>Store Management & Storefront State:</strong> We store your store configuration, theme preferences, domain mapping settings, and store availability mode (Online/Offline state).
              </li>
              <li>
                <strong>Order & Customer Transaction Data:</strong> Information regarding orders placed on your storefront, including customer delivery details, item breakdown, payment status, and parcel logistics tracking.
              </li>
              <li>
                <strong>Security & Session Monitoring:</strong> Data logged to maintain platform security, protect merchant accounts, and enforce access permissions.
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>To provide, operate, and maintain your multi-tenant e-commerce store and merchant dashboard.</li>
              <li>To manage subscriptions, package limits (e.g., product quotas), and automated billing cycles.</li>
              <li>To power built-in analytics, order tracking, and automated courier logistics integrations.</li>
              <li>To evaluate transaction security and prevent fraudulent activities.</li>
              <li>To enforce platform policies and manage account statuses (Active, Inactive, Pending, Suspended, or Banned).</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              3. Data Sharing & Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We do not sell your personal or merchant data. We share necessary data strictly with trusted third-party providers required to operate your store, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Courier & Logistics Partners:</strong> Delivery details sent for automated order shipping and parcel tracking.</li>
              <li><strong>Payment Gateways:</strong> Secure transaction parameters for processing subscription payments and customer checkouts.</li>
              <li><strong>Infrastructure & Security Services:</strong> Cloud servers and secure hosting infrastructure.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              4. Data Retention & Account Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard encryption, session security, and account protection mechanisms. You are responsible for preserving the confidentiality of your credentials and API keys.
            </p>
          </div>
        )
      )}

      {policyType === 'terms-of-service' && (
        lang === 'bn' ? (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              ১. শর্তাবলীতে সম্মতি
            </h2>
            <p className="leading-relaxed">
              MASH ECO প্ল্যাটফর্ম, মার্চেন্ট ড্যাশবোর্ড বা সেবা ব্যবহারের মাধ্যমে আপনি আইনগতভাবে এই ব্যবহারের শর্তাবলীতে সম্মতি প্রদান করছেন। আপনি যদি এই শর্তাবলি মেনে নিতে অসম্মত হন, তবে অনতিবিলম্বে প্ল্যাটফর্মের ব্যবহার বন্ধ করুন।
            </p>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. অ্যাকাউন্ট স্টেটাস ও সুপার এডমিন শাসনব্যবস্থা
            </h2>
            <p className="leading-relaxed mb-3">
              MASH ECO প্ল্যাটফর্মের ক্রেতা, বিক্রেতা ও সিস্টেমের স্থিতিশীলতা রক্ষায় সুনির্দিষ্ট নিয়মমালা প্রয়োগ করে। প্ল্যাটফর্ম সুপার এডমিনিস্ট্রেটরদের মার্চেন্ট অ্যাকাউন্ট স্টেটাস ও স্টোর মোড পরিচালনার পূর্ণ এখতিয়ার রয়েছে:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Active Status (সক্রিয় অবস্থা):</strong> স্টোর ওয়েবসাইটটি ক্রেতাদের জন্য সম্পূর্ণ লাইভ থাকবে এবং কেনাকাটা করা যাবে। মার্চেন্ট ড্যাশবোর্ডে পূর্ণ Read-Write অ্যাক্সেস পাবেন।
              </li>
              <li>
                <strong>Inactive / Pending Status (নিষ্ক্রিয় / অপেক্ষমাণ):</strong> স্টোর ওয়েবসাইটটি অফলাইন থাকবে। মার্চেন্ট স্টোর সেটআপ, ভেরিফিকেশন বা সাবস্ক্রিপশন বাছাইয়ের জন্য ড্যাশবোর্ড ব্যবহার করতে পারবেন।
              </li>
              <li>
                <strong>Suspended Status (স্থগিত - Read-Only Mode):</strong> মেয়াদী বিল পরিশোধ না করা বা নীতি পর্যালোচনার কারণে অ্যাকাউন্ট স্থগিত হলে স্টোরসাইট অফলাইন হয়ে যাবে। মার্চেন্টের ড্যাশবোর্ড <strong>Read-Only Mode (শুধুমাত্র দেখার মোড)</strong>-এ পরিবর্তিত হবে—যেখানে মার্চেন্ট আগের সেলস রিপোর্ট, কাস্টমার ডেটা দেখতে পারবেন এবং সাপোর্ট টিকিট পাঠাতে বা সাবস্ক্রিপশন রিনিউ করতে পারবেন, কিন্তু নতুন প্রোডাক্ট তৈরি বা এডিট করা নিষিদ্ধ থাকবে।
              </li>
              <li>
                <strong>Banned Status (নিষিদ্ধ):</strong> মারাত্মক নীতি লঙ্ঘন, জালিয়াতি বা অবৈধ কার্যকলাপে জড়িত অ্যাকাউন্ট চিরতরে নিষিদ্ধ (Banned) করা হবে এবং ড্যাশবোর্ড ও স্টোর অ্যাক্সেস অবিলম্বে বাতিল করা হবে।
              </li>
              <li>
                <strong>Store Mode (অনলাইন / অফলাইন টগল):</strong> এডমিন বা মার্চেন্ট প্রয়োজন অনুযায়ী স্টোরের কেনাকাটা সুবিধা চালু (Online) বা বন্ধ (Offline) রাখতে পারবেন।
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৩. সাবস্ক্রিপশন, প্যাকেজ ও বিলিং
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>প্ল্যান ও কোটা:</strong> প্যাকেজ অনুযায়ী প্রোডাক্ট আপলোড সীমা, কাস্টম ডোমেন সুবিধা ও ফিচার নির্ধারিত হয়।
              </li>
              <li>
                <strong>বিলিং সাইকেল:</strong> সাবস্ক্রিপশন ফি অগ্রিম হিসেবে মাসিক বা বার্ষিক ভিত্তিতে প্রযোজ্য হবে।
              </li>
              <li>
                <strong>মেয়াদোত্তীর্ণ অবস্থা:</strong> সাবস্ক্রিপশনের মেয়াদ শেষ হলে পেমেন্ট আপডেট না করা পর্যন্ত স্টোর স্বয়ংক্রিয়ভাবে অফলাইন হয়ে যাবে।
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৪. মার্চেন্টের দায়িত্ব ও গ্রহণযোগ্য ব্যবহার
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>সঠিক ব্যবসায়িক তথ্য ও বৈধ কাগজপত্র প্রদান করা বাধ্যতামূলক।</li>
              <li>পণ্য ক্যাটালগ, অর্ডারের শিপিং ও কাস্টমার সার্ভিসের জন্য মার্চেন্ট নিজে দায়ী থাকবেন।</li>
              <li>নকল পণ্য, অবৈধ বস্তু বা নিষিদ্ধ সামগ্রী বিক্রি করা কঠোরভাবে নিষিদ্ধ।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৫. দায়বদ্ধতার সীমা
            </h2>
            <p className="leading-relaxed">
              প্ল্যাটফর্মের নীতিমালার অধীনে স্টোর অফলাইন থাকা, কুরিয়ার বিলম্ব, পেমেন্ট গেটওয়ে বা কোনো প্রকার পরোক্ষ ক্ষতির জন্য MASH ECO দায়ী থাকবে না।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">Last Updated: October 2026</p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using the MASH ECO platform, merchant dashboard, administrative portals, or services, you agree to be legally bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately cease all access to the platform.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. Account Statuses & Super Admin Governance
            </h2>
            <p className="leading-relaxed mb-3">
              MASH ECO enforces strict multi-tenant governance to protect buyers, merchants, and system stability. Super Administrators retain full authority to manage tenant account statuses and store modes:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Active Status:</strong> The storefront website is fully live to buyers and customers can place orders. The merchant has complete read-write access to the dashboard.
              </li>
              <li>
                <strong>Inactive / Pending Status:</strong> The storefront is offline and inaccessible to public buyers. The merchant retains access to the dashboard to complete store setup, verification, or plan selection.
              </li>
              <li>
                <strong>Suspended Status (Read-Only Mode):</strong> If an account is suspended (e.g., due to billing expiration, compliance inquiry, or policy review), the storefront is set to offline mode. The merchant dashboard operates in <strong>Read-Only Mode</strong>—the merchant can view existing sales reports, customer data, and submit support tickets or renew subscriptions, but creation/modification of products and processing of orders is restricted until resolved.
              </li>
              <li>
                <strong>Banned Status:</strong> Accounts banned for severe policy violations, fraud, or illegal activities are permanently barred, and all access to the merchant dashboard and storefront is revoked immediately.
              </li>
              <li>
                <strong>Store Mode (Online / Offline Toggle):</strong> Administrators or merchants may toggle store availability between Online and Offline modes. When set to Offline, customers attempting to visit the storefront will receive an offline notification.
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              3. Subscriptions, Packages & Billing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Plans & Quotas:</strong> Subscription packages define product limits, custom domain eligibility, and feature access. Product creation is capped based on your active plan tier.
              </li>
              <li>
                <strong>Billing Cycles & Renewal:</strong> Subscriptions are billed in advance on a recurring monthly or yearly basis. Subscription statuses (Active, Expired, Pending, Cancelled) determine feature availability.
              </li>
              <li>
                <strong>Expiration:</strong> If a subscription expires without renewal, store status automatically transitions to inactive or suspended, bringing the public storefront offline until payment is updated.
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              4. Merchant Responsibilities & Acceptable Use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate business registration details during seller onboarding.</li>
              <li>You are solely responsible for product catalog compliance, inventory fulfillment, and customer support.</li>
              <li>Selling counterfeit goods, illegal items, fraudulent services, or violating local trade regulations is strictly prohibited.</li>
              <li>Attempting to bypass platform security, API rate limits, or fraud detection systems will lead to immediate account ban.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              MASH ECO shall not be liable for any indirect, incidental, consequential, or lost revenue damages arising out of storefront offline states, courier delays, third-party payment gateway downtime, or account suspensions enforced under platform policy guidelines.
            </p>
          </div>
        )
      )}

      {policyType === 'cookie-policy' && (
        lang === 'bn' ? (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              এই কুকি পলিসিতে বিস্তারিত ব্যাখ্যা করা হয়েছে কীভাবে MASH ECO প্ল্যাটফর্মে ব্যবহারকারীদের পরিচয় নিশ্চিত করতে, অ্যাকাউন্ট নিরাপদ রাখতে এবং ড্যাশবোর্ড সুবিধা প্রদান করতে কুকি ও সেশন প্রযুক্তি ব্যবহার করা হয়।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              আমরা যেসব কুকি ও সেশন প্রযুক্তি ব্যবহার করি
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>প্রয়োজনীয় অথেন্টিকেশন কুকি ও টোকেন:</strong> নিরাপদ সেশন কুকি ও টোকেন যা মার্চেন্ট ড্যাশবোর্ডে প্রবেশের পরিচয় বজায় রাখতে ব্যবহৃত হয়।
              </li>
              <li>
                <strong>সিকিউরিটি ও সেশন স্টোরেজ:</strong> ব্রাউজার সিকিউরিটি এনফোর্স করতে এবং অ্যাকাউন্ট স্থগিত বা ব্যান হলে নিরাপত্তা নিশ্চিত করার জন্য ব্যবহৃত সেশন ডেটা।
              </li>
              <li>
                <strong>অ্যানালিটিক্স ও জালিয়াতি প্রতিরোধ কুকি:</strong> প্ল্যাটফর্মের গতিবিধি পরীক্ষা করতে এবং ফ্রড ট্রাফিক স্ক্যান করতে ব্যবহৃত কুকি।
              </li>
              <li>
                <strong>ইউজার ইন্টারফেস পছন্দ কুকি:</strong> মার্চেন্টের পছন্দমতো ড্যাশবোর্ড ফিল্টার বা লেআউট মনে রাখার জন্য কুকি।
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              কুকি ব্যবস্থাপনা
            </h2>
            <p className="leading-relaxed">
              আপনি ব্রাউজার সেটিংসের মাধ্যমে কুকি নিয়ন্ত্রণ বা মুছে ফেলতে পারেন। তবে মনে রাখবেন, প্রয়োজনীয় সেশন কুকি বন্ধ করে দিলে মার্চেন্ট ড্যাশবোর্ডে নিরাপদে লগইন করা বা সেবা গ্রহণ করা সম্ভব হবে না।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">Last Updated: October 2026</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              This Cookie Policy explains how MASH ECO utilizes cookies, tokens, and browser storage mechanisms to authenticate users, protect merchant accounts, and power dashboard interactions.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              Types of Cookies & Storage We Use
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Essential Authentication Cookies & Tokens:</strong> Secure session cookies and tokens used to identify logged-in merchants and maintain authenticated sessions.
              </li>
              <li>
                <strong>Security & Session Storage:</strong> Session tokens utilized to enforce security policies and protect accounts.
              </li>
              <li>
                <strong>Analytics & Fraud Prevention Cookies:</strong> Usage tokens that monitor platform performance, track dashboard navigation, and analyze store traffic patterns for fraud detection.
              </li>
              <li>
                <strong>Preference & UI State Cookies:</strong> Storage used to remember layout preferences and active navigation filters across sessions.
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              Managing Cookies
            </h2>
            <p className="leading-relaxed">
              You can control or clear cookies using your browser settings. However, because essential cookies are necessary to securely authenticate your dashboard access and maintain store state, disabling essential cookies will prevent login to the merchant dashboard.
            </p>
          </div>
        )
      )}
    </div>
  );
}
