import Link from "next/link";
import GuestRoute from "@/components/GuestRoute";

export default function Home() {
  return (
    <GuestRoute>
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-purple-500/30 overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Cliply
              </Link>
              <nav className="hidden md:flex gap-6">
                <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</a>
              </nav>
            </div>
            <Link 
              href="/login" 
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 font-medium text-sm transform hover:scale-105 active:scale-95"
            >
              Log In
            </Link>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
            <div className="absolute top-[20%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
                Your AI-Powered <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                  Second Brain
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Capture ideas from anywhere online or write daily notes. Let our AI automatically tag, organize, and synthesize your knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Start for Free
                </Link>
                <a href="#features" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all duration-300 backdrop-blur-sm">
                  Explore Features
                </a>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 bg-black/50 border-y border-white/5 relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Smarter Note-Taking</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Designed to help you think better, remember more, and stay organized effortlessly.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-cyan-500/30 transition-colors group">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Smart Web Clipping</h3>
                  <p className="text-gray-400 leading-relaxed">Save articles, snippets, and online notes instantly. Our AI automatically extracts the most important information.</p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-colors group">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Auto-Organization</h3>
                  <p className="text-gray-400 leading-relaxed">Never worry about folders again. Our AI categorizes, tags, and connects your notes so you can find them instantly.</p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-colors group">
                  <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Distraction-Free Writing</h3>
                  <p className="text-gray-400 leading-relaxed">A beautiful, minimal notebook interface for your daily thoughts, journals, and tasks. Focus on what matters.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="py-24 relative overflow-hidden scroll-mt-20">
            <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">How Cliply Works</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Three simple steps to build your ultimate knowledge base.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold text-2xl flex items-center justify-center mx-auto mb-6">1</div>
                  <h3 className="text-xl font-bold mb-3">Capture</h3>
                  <p className="text-gray-400">Write down your thoughts or clip useful articles and snippets from the web with one click.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold text-2xl flex items-center justify-center mx-auto mb-6">2</div>
                  <h3 className="text-xl font-bold mb-3">Analyze</h3>
                  <p className="text-gray-400">Our AI steps in to read, summarize, and extract key entities and themes from your notes.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 font-bold text-2xl flex items-center justify-center mx-auto mb-6">3</div>
                  <h3 className="text-xl font-bold mb-3">Retrieve</h3>
                  <p className="text-gray-400">Ask your AI assistant anything or browse through auto-generated tags to find exactly what you need.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-black text-center text-gray-500">
          <p>© 2026 Cliply. All rights reserved.</p>
        </footer>
      </div>
    </GuestRoute>
  );
}
