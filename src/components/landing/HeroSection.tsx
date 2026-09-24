import Link from 'next/link';
import { ArrowRight, ShoppingCart, BarChart3, Globe } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--accent-primary))]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-tight">
          One Platform <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent-primary))] to-purple-600">
            Thousands of Success Stories
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-xl text-gray-600 mb-8 sm:mb-10">
          Your one-stop shop to take your business online. Setup your business e-commerce store with just a few clicks. No coding required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" prefetch={false} className="w-full sm:w-auto btn-primary py-2 px-4 sm:py-4 sm:px-8 text-sm sm:text-lg group">
            Start Free Trial 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/landing/book-a-demo" className="w-full sm:w-auto px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-lg font-medium text-gray-700 bg-white border border-gray-200 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors">
            Book a Demo
          </Link>
        </div>

        <div className="mt-20 flex justify-center">
          <div className="glass-panel p-2 w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl relative">
            <div className="flex absolute -top-4 -left-2 sm:-top-6 sm:-left-6 bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 items-center gap-2 sm:gap-3 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="bg-green-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-green-600">
                <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">New Order</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">$120.00</p>
              </div>
            </div>
            
            <div className="flex absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 items-center gap-2 sm:gap-3 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-blue-600">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Weekly Sales</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">+45.2%</p>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-xl md:rounded-2xl shadow-sm object-cover max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
