import React from "react";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-semibold text-purple-900 mb-2">Total Notes</h3>
          <p className="text-3xl font-bold text-purple-600">124</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">AI Chats</h3>
          <p className="text-3xl font-bold text-blue-600">32</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <h3 className="font-semibold text-emerald-900 mb-2">Tasks Completed</h3>
          <p className="text-3xl font-bold text-emerald-600">89</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notes</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Meeting Notes - Design Sync {i}</h4>
                    <p className="text-sm text-gray-500">Updated 2 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
