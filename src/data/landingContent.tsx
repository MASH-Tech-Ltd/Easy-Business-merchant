import { ReactNode } from "react";
import Link from "next/link";
import ContactForm from "@/components/landing/ContactForm";
import BookDemoForm from "@/components/landing/BookDemoForm";
import LegalPolicyViewer from "@/components/landing/LegalPolicyViewer";

export const contentMap: Record<string, ReactNode> = {
  "about-us": (
    <div className="space-y-8 text-left text-gray-700 leading-relaxed">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Empowering Merchants Everywhere
        </h2>
        <p className="mb-4">
          MASH ECO was founded with a singular vision: to dismantle the
          technical barriers of e-commerce and empower entrepreneurs to build,
          scale, and manage their online businesses effortlessly. In today's
          digital-first economy, setting up a store shouldn't require a degree
          in computer science or a massive upfront investment in web
          development.
        </p>
        <p>
          We provide a comprehensive, multi-tenant SaaS platform tailored
          specifically for modern merchants. From inventory management to
          courier automation, our suite of tools is designed to handle the heavy
          lifting, letting you focus on what matters most—delivering exceptional
          products to your customers.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What Sets Us Apart
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">
              All-in-One Ecosystem
            </h3>
            <p className="text-sm">
              We integrate products, categories, orders, customers, and checkout
              leads into a single, cohesive dashboard.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">
              Advanced Fraud Check
            </h3>
            <p className="text-sm">
              Our built-in fraud detection algorithms protect your revenue,
              ensuring safe and secure transactions for every order.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Courier Automation</h3>
            <p className="text-sm">
              Seamlessly sync with local and international logistics partners to
              automate tracking, fulfillment, and returns.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">
              Custom Themes & Domains
            </h3>
            <p className="text-sm">
              Bring your brand to life with highly customizable storefront
              themes and white-labeled custom domain mapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  /*
  'careers': (
    <div className="space-y-8 text-left text-gray-700 leading-relaxed">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Build the Future of E-Commerce With Us</h2>
        <p>
          At MASH ECO, our team is our greatest asset. We are a group of passionate engineers, designers, and e-commerce enthusiasts dedicated to building the most intuitive merchant dashboard in the industry. We value innovation, transparency, and a relentless drive to solve complex problems for our users.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h3>
        
        <div className="space-y-6">
          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">Marketing Manager</h4>
                <p className="text-sm text-gray-500">Remote / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Growth</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Lead our digital marketing initiatives and merchant acquisition campaigns.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">UX Designer</h4>
                <p className="text-sm text-gray-500">Hybrid / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Design</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Design premium, responsive themes for our merchants and refine the UX of our dashboard.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">Backend Engineer (SQL/PostgreSQL)</h4>
                <p className="text-sm text-gray-500">Remote / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Engineering</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Architect scalable multi-tenant databases and optimize complex relational queries.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">Frontend Engineer (Next.js)</h4>
                <p className="text-sm text-gray-500">Remote / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Engineering</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Help us scale our Next.js architecture and optimize our Tailwind design system.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">Mobile Developer (Flutter)</h4>
                <p className="text-sm text-gray-500">Remote / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Engineering</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Build and maintain our cross-platform merchant companion mobile app.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-6 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-700 line-through">Customer Support Specialist</h4>
                <p className="text-sm text-gray-500">Remote / Full-Time</p>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">Support</span>
            </div>
            <p className="text-sm mb-4 text-gray-500">Provide world-class technical and billing support to our growing merchant base.</p>
            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">Position Filled</span>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm italic">Don't see a perfect fit? Send your resume to <a href="mailto:info@masheco.com" className="text-[hsl(var(--accent-primary))] font-medium">info@masheco.com</a> and we'll keep you in mind.</p>
    </div>
  ),
  */
  contact: (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">
          Whether you need help setting up your custom domain, have questions
          about our subscription tiers, or need support—our team is here for
          you.
        </p>
      </div>

      <ContactForm />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 text-center">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Email</h4>
          <p className="text-sm text-gray-600 truncate break-words">support@masheco.com</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
          <p className="text-sm text-gray-600">(+880) 1880840849</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-bold text-gray-900 mb-1">Address</h4>
          <p className="text-sm text-gray-600">
            1704, National University, Gazipur
          </p>
        </div>
      </div>
    </div>
  ),
  "privacy-policy": <LegalPolicyViewer policyType="privacy-policy" />,
  "terms-of-service": <LegalPolicyViewer policyType="terms-of-service" />,
  "cookie-policy": <LegalPolicyViewer policyType="cookie-policy" />,
  documentation: (
    <div className="space-y-8 text-left text-gray-700">
      <div className="bg-[hsl(var(--accent-primary))]/5 border border-[hsl(var(--accent-primary))]/20 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-[hsl(var(--accent-primary))] mb-2">
          Platform Documentation
        </h2>
        <p>
          Welcome to the MASH ECO help center. Here you'll find comprehensive
          guides and tutorials to help you get the most out of your merchant
          dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
            Getting Started
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Learn how to configure your store, set up your first product, and
            manage categories.
          </p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">
            Read Guide &rarr;
          </span>
        </div>

        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
            Custom Domains
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Step-by-step instructions for mapping your own custom domain to your
            MASH ECO storefront.
          </p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">
            Read Guide &rarr;
          </span>
        </div>

        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
            Courier Automation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure logistics integrations to automatically dispatch orders
            and track deliveries.
          </p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">
            Read Guide &rarr;
          </span>
        </div>

        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
            Fraud Protection
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Understand how our fraud-check system scores orders and how to
            review flagged checkouts.
          </p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">
            Read Guide &rarr;
          </span>
        </div>
      </div>
    </div>
  ),
  "api-reference": (
    <div className="space-y-6 text-left text-gray-700">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">API Reference</h2>
          <p className="text-gray-500 mt-2">
            REST API documentation for building custom integrations.
          </p>
        </div>
        <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-mono">
          v1.0.0
        </span>
      </div>

      <div className="bg-gray-900 text-gray-300 rounded-xl overflow-hidden font-mono text-sm">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
          Authentication
        </div>
        <div className="p-6">
          <p className="mb-4">
            All API requests require a Bearer token generated from your{" "}
            <Link
              href="/dashboard/api-keys"
              className="text-blue-400 hover:underline"
            >
              dashboard
            </Link>
            .
          </p>
          <code className="text-green-400 block bg-black p-4 rounded-lg">
            Authorization: Bearer sk_live_your_api_key_here
          </code>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 pt-4">Core Endpoints</h3>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs">
              GET
            </span>
            <code className="font-mono font-medium text-gray-900">
              /api/v1/products
            </code>
          </div>
          <div className="p-4 text-sm">
            <p>
              Retrieve a paginated list of your store's products, including
              inventory counts and category assignments.
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">
              POST
            </span>
            <code className="font-mono font-medium text-gray-900">
              /api/v1/orders
            </code>
          </div>
          <div className="p-4 text-sm">
            <p>
              Programmatically create a new order. Triggers fraud checks and
              automated courier dispatch if enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  blog: (
    <div className="space-y-8 text-left">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          The Merchant's Journal
        </h2>
        <p className="text-gray-600">
          Insights, updates, and strategies to help you grow your e-commerce
          business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <article className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">
                Product Update
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Introducing Advanced Courier Automation
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Say goodbye to manual shipping labels. Our new integration
              connects directly with top logistics providers globally.
            </p>
            <span className="text-[hsl(var(--accent-primary))] text-sm font-bold cursor-pointer">
              Read article &rarr;
            </span>
          </div>
        </article>

        <article className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-600"></div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                E-commerce Tips
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              How to Reduce Abandoned Checkout Leads
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Learn how to leverage our analytics dashboard to identify friction
              points and recover lost sales effectively.
            </p>
            <span className="text-[hsl(var(--accent-primary))] text-sm font-bold cursor-pointer">
              Read article &rarr;
            </span>
          </div>
        </article>
      </div>
    </div>
  ),
  "book-a-demo": (
    <div className="space-y-8 text-center max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See MASH ECO in action. Schedule a 30-minute personalized walkthrough
          with one of our e-commerce experts and discover how we can help scale
          your business.
        </p>
      </div>

      <BookDemoForm />
    </div>
  ),
  "demo": (
    <div className="space-y-8 text-center max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See MASH ECO in action. Schedule a 30-minute personalized walkthrough
          with one of our e-commerce experts and discover how we can help scale
          your business.
        </p>
      </div>

      <BookDemoForm />
    </div>
  ),
};
