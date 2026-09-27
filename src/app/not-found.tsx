import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-extrabold text-[hsl(var(--accent-primary))]/10 tracking-widest select-none">
              404
            </h1>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full mb-4">Error 404</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Oops! Page not found
              </h2>
            </div>
          </div>
          
          <p className="mt-4 text-lg text-gray-600 mb-10 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-primary))]/90 text-white font-medium rounded-lg shadow-lg shadow-[hsl(var(--accent-primary))]/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return Home
            </Link>
            <Link
              href="/landing/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 hover:border-[hsl(var(--accent-primary))] text-gray-700 hover:text-[hsl(var(--accent-primary))] font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
