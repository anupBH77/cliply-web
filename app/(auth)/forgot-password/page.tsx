import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-zinc-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-red-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-zinc-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your email and we'll send you instructions to reset your password.</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
          
          <button 
            type="button"
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-zinc-500 to-red-500 text-white font-semibold hover:from-zinc-400 hover:to-red-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Send Reset Link
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
            &larr; Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
