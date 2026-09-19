import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <img src="/MEasy.png" alt="MashEasy" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-hover))] bg-clip-text text-transparent">
              MashEasy
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Home</Link>
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Pricing</Link>
            <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">
              Merchant Login
            </Link>
            <Link href="/register" className="btn-primary py-2 px-5 shadow-lg shadow-[hsl(var(--accent-primary))]/20 hover:shadow-[hsl(var(--accent-primary))]/40">
              Become a Merchant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
