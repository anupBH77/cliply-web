"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notesApi } from "../../lib/api";
import { Note } from "../../types";
import { FileText } from "lucide-react";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    notesApi.getNotes()
      .then(data => {
        // Sort by updated_at descending
        const sortedNotes = data.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNotes(sortedNotes);
      })
      .catch(err => {
        console.error("Failed to fetch notes:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#7C3AED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">Total Notes</h3>
              <p className="text-3xl font-bold text-purple-600">{notes.length}</p>
            </div>
            {/* Other sections removed for now as requested */}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notes</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {notes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    You haven't created any notes yet.
                  </div>
                ) : (
                  notes.slice(0, 10).map((note) => (
                    <div 
                      key={note.id} 
                      onClick={() => router.push(`/notes/${note.id}`)}
                      className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{note.title || "Untitled Note"}</h4>
                          <p className="text-sm text-gray-500">
                            Updated {new Date(note.updated_at).toLocaleDateString()} at {new Date(note.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
