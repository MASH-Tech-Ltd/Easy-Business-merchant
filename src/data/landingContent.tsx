import { ReactNode } from 'react';
import Link from 'next/link';
import ContactForm from '@/components/landing/ContactForm';

export const contentMap: Record<string, ReactNode> = {
  'about-us': (
    <div className="space-y-8 text-left text-gray-700 leading-relaxed">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Empowering Merchants Everywhere</h2>
        <p className="mb-4">
          MASH ECO was founded with a singular vision: to dismantle the technical barriers of e-commerce and empower entrepreneurs to build, scale, and manage their online businesses effortlessly. In today's digital-first economy, setting up a store shouldn't require a degree in computer science or a massive upfront investment in web development.
        </p>
        <p>
          We provide a comprehensive, multi-tenant SaaS platform tailored specifically for modern merchants. From inventory management to courier automation, our suite of tools is designed to handle the heavy lifting, letting you focus on what matters most—delivering exceptional products to your customers.
        </p>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">All-in-One Ecosystem</h3>
            <p className="text-sm">We integrate products, categories, orders, customers, and checkout leads into a single, cohesive dashboard.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Advanced Fraud Check</h3>
            <p className="text-sm">Our built-in fraud detection algorithms protect your revenue, ensuring safe and secure transactions for every order.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Courier Automation</h3>
            <p className="text-sm">Seamlessly sync with local and international logistics partners to automate tracking, fulfillment, and returns.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Custom Themes & Domains</h3>
            <p className="text-sm">Bring your brand to life with highly customizable storefront themes and white-labeled custom domain mapping.</p>
          </div>
        </div>
      </div>
    </div>
  ),
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
  'contact': (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">
          Whether you need help setting up your custom domain, have questions about our subscription tiers, or need API support—our team is here for you.
        </p>
      </div>

      <ContactForm />

      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 text-center">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Email</h4>
          <p className="text-sm text-gray-600">support@masheco.com</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
          <p className="text-sm text-gray-600">(+880) 1880840849</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Address</h4>
          <p className="text-sm text-gray-600">1704, National University, Gazipur</p>
        </div>
      </div>
    </div>
  ),
  'privacy-policy': (
    <div className="space-y-6 text-left text-gray-700">
      <p className="text-sm text-gray-500 font-medium">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p>Mash Eco ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our merchant dashboard services.</p>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Account Data:</strong> When you register for a merchant account, we collect your name, email address, password, phone number, and business details.</li>
        <li><strong>Transaction Data:</strong> We collect details regarding transactions you process through your store, including customer data, order histories, and payment status (processed securely via our partners).</li>
        <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our dashboard, including IP addresses, browser types, and access times to improve our analytics and fraud detection services.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">2. How We Use Your Information</h2>
      <p>We use the collected information for various purposes, including:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>To provide, operate, and maintain the MASH ECO platform.</li>
        <li>To process transactions and send related information, including confirmations and invoices.</li>
        <li>To manage your custom domain settings and subscriptions.</li>
        <li>To monitor and analyze trends for our built-in analytics dashboard.</li>
        <li>To detect, prevent, and address fraud or technical issues using our fraud-check systems.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">3. Data Sharing and Disclosure</h2>
      <p>We do not sell your personal data. We may share information with trusted third-party service providers (like courier partners and payment gateways) strictly for the purpose of operating your store and fulfilling your automated logistics.</p>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">4. Data Security</h2>
      <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure. You are responsible for keeping your API keys and login credentials confidential.</p>
    </div>
  ),
  'terms-of-service': (
    <div className="space-y-6 text-left text-gray-700">
      <p className="text-sm text-gray-500 font-medium">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
      <p>By accessing or using the MASH ECO platform, APIs, and merchant dashboard, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">2. Description of Service</h2>
      <p>MASH ECO provides a multi-tenant SaaS e-commerce solution that allows merchants to create online storefronts, manage products, process orders, and utilize automated courier integrations. We reserve the right to modify, suspend, or discontinue any part of the service at any time.</p>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">3. Merchant Responsibilities</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>You must provide accurate business information and maintain the security of your account credentials and API keys.</li>
        <li>You are solely responsible for the products you sell, your customer service, and compliance with local laws and tax regulations.</li>
        <li>You agree not to use the platform for any illegal activities or to sell prohibited items.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">4. Subscriptions and Billing</h2>
      <p>Certain features (e.g., custom domains, advanced analytics, premium themes) require a paid subscription. Subscription fees are billed in advance on a recurring basis. You may cancel your subscription at any time via the billing dashboard.</p>

      <h2 className="text-2xl font-bold text-gray-900 pt-4">5. Limitation of Liability</h2>
      <p>In no event shall Mash Eco, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.</p>
    </div>
  ),
  'cookie-policy': (
    <div className="space-y-6 text-left text-gray-700">
      <h2 className="text-2xl font-bold text-gray-900">Cookie Policy</h2>
      <p>This Cookie Policy explains how MASH ECO uses cookies and similar technologies to recognize you when you visit our platform.</p>
      
      <h3 className="text-xl font-bold text-gray-900 pt-2">What are cookies?</h3>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information.</p>
      
      <h3 className="text-xl font-bold text-gray-900 pt-2">How we use cookies</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Essential Cookies:</strong> Required to authenticate merchants and secure the dashboard.</li>
        <li><strong>Analytics Cookies:</strong> Used to track platform performance and gather data for your store analytics.</li>
        <li><strong>Functionality Cookies:</strong> Used to remember your preferences (e.g., theme settings, language).</li>
      </ul>
      <p>You have the right to decide whether to accept or reject cookies through your browser settings. However, rejecting essential cookies may prevent you from using the merchant dashboard.</p>
    </div>
  ),
  'documentation': (
    <div className="space-y-8 text-left text-gray-700">
      <div className="bg-[hsl(var(--accent-primary))]/5 border border-[hsl(var(--accent-primary))]/20 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-[hsl(var(--accent-primary))] mb-2">Platform Documentation</h2>
        <p>Welcome to the MASH ECO help center. Here you'll find comprehensive guides and tutorials to help you get the most out of your merchant dashboard.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">Getting Started</h3>
          <p className="text-sm text-gray-600 mb-4">Learn how to configure your store, set up your first product, and manage categories.</p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">Read Guide &rarr;</span>
        </div>
        
        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">Custom Domains</h3>
          <p className="text-sm text-gray-600 mb-4">Step-by-step instructions for mapping your own custom domain to your MASH ECO storefront.</p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">Read Guide &rarr;</span>
        </div>
        
        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">Courier Automation</h3>
          <p className="text-sm text-gray-600 mb-4">Configure logistics integrations to automatically dispatch orders and track deliveries.</p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">Read Guide &rarr;</span>
        </div>
        
        <div className="border border-gray-200 p-6 rounded-xl hover:border-[hsl(var(--accent-primary))]/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">Fraud Protection</h3>
          <p className="text-sm text-gray-600 mb-4">Understand how our fraud-check system scores orders and how to review flagged checkouts.</p>
          <span className="text-[hsl(var(--accent-primary))] text-sm font-medium">Read Guide &rarr;</span>
        </div>
      </div>
    </div>
  ),
  'api-reference': (
    <div className="space-y-6 text-left text-gray-700">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">API Reference</h2>
          <p className="text-gray-500 mt-2">REST API documentation for building custom integrations.</p>
        </div>
        <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-mono">v1.0.0</span>
      </div>

      <div className="bg-gray-900 text-gray-300 rounded-xl overflow-hidden font-mono text-sm">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">Authentication</div>
        <div className="p-6">
          <p className="mb-4">All API requests require a Bearer token generated from your <Link href="/dashboard/api-keys" className="text-blue-400 hover:underline">dashboard</Link>.</p>
          <code className="text-green-400 block bg-black p-4 rounded-lg">
            Authorization: Bearer sk_live_your_api_key_here
          </code>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 pt-4">Core Endpoints</h3>
        
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs">GET</span>
            <code className="font-mono font-medium text-gray-900">/api/v1/products</code>
          </div>
          <div className="p-4 text-sm">
            <p>Retrieve a paginated list of your store's products, including inventory counts and category assignments.</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">POST</span>
            <code className="font-mono font-medium text-gray-900">/api/v1/orders</code>
          </div>
          <div className="p-4 text-sm">
            <p>Programmatically create a new order. Triggers fraud checks and automated courier dispatch if enabled.</p>
          </div>
        </div>
      </div>
    </div>
  ),
  'blog': (
    <div className="space-y-8 text-left">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Merchant's Journal</h2>
        <p className="text-gray-600">Insights, updates, and strategies to help you grow your e-commerce business.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <article className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">Product Update</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Introducing Advanced Courier Automation</h3>
            <p className="text-gray-600 text-sm mb-4">Say goodbye to manual shipping labels. Our new integration connects directly with top logistics providers globally.</p>
            <span className="text-[hsl(var(--accent-primary))] text-sm font-bold cursor-pointer">Read article &rarr;</span>
          </div>
        </article>
        
        <article className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-600"></div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">E-commerce Tips</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">How to Reduce Abandoned Checkout Leads</h3>
            <p className="text-gray-600 text-sm mb-4">Learn how to leverage our analytics dashboard to identify friction points and recover lost sales effectively.</p>
            <span className="text-[hsl(var(--accent-primary))] text-sm font-bold cursor-pointer">Read article &rarr;</span>
          </div>
        </article>
      </div>
    </div>
  ),
  'book-a-demo': (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">
          See MASH ECO in action. Schedule a 30-minute personalized walkthrough with one of our e-commerce experts and discover how we can help scale your business.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all" required placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all" required placeholder="Smith" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Business Email *</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all" required placeholder="john@business.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Business Name *</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all" required placeholder="Acme Store" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Monthly Revenue</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-700">
              <option>Just starting out</option>
              <option>BDT 50,000 - BDT 200,000</option>
              <option>BDT 200,000 - BDT 1,000,000</option>
              <option>BDT 1,000,000 - BDT 5,000,000</option>
              <option>BDT 5,000,000+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">What are you looking to achieve?</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all" placeholder="Tell us a bit about your current challenges..."></textarea>
          </div>
          
          <button type="button" className="w-full py-4 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-hover))] text-white font-bold rounded-lg shadow-lg shadow-[hsl(var(--accent-primary))]/30 transition-all transform hover:-translate-y-0.5 text-lg">
            Schedule My Demo
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            By submitting this form, you agree to our <Link href="/landing/privacy-policy" className="text-[hsl(var(--accent-primary))] hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  )
};
