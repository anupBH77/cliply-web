import React from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default function NotesIndexPage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/50 p-8">
      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 mb-6 shadow-sm border border-purple-200">
        <FileText size={32} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select a note or create a new one.</h2>
      <p className="text-gray-500 mb-8 max-w-sm text-center">
        Capture your thoughts, save important information, and organize your ideas with our AI-powered editor.
      </p>
      <Link 
        href="/notes/new"
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium"
      >
        <Plus size={20} />
        <span>Create New Note</span>
      </Link>
    </div>
  );
}
