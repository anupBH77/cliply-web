"use client";

import React, { useEffect, useState } from "react";
import { FileText, Search, RotateCcw } from "lucide-react";
import { notesApi } from "../../../../lib/api";
import { Note } from "../../../../types";
import { useTheme } from "../../../../lib/ThemeContext";

export default function TrashPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const fetchTrash = () => {
    setIsLoading(true);
    notesApi.getDeletedNotes()
      .then((data) => {
        const sortedNotes = data.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNotes(sortedNotes);
      })
      .catch((err) => console.error("Failed to load deleted notes", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notesApi.restoreNote(id);
      fetchTrash();
    } catch (err) {
      console.error("Failed to restore note", err);
    }
  };

  const filteredNotes = notes.filter(n =>
    (n.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.content && JSON.stringify(n.content).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className={`border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-4 flex-1">
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Trash</h1>
          <div className="relative max-w-md w-full">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text"
              placeholder="Search trash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
        <div className="w-full mx-auto">
          {isLoading ? (
            <div className="flex justify-center p-12 text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#7C3AED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading trash...
            </div>
          ) : notes.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Trash is empty.</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                Notes you delete will appear here.
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No matching notes found for "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
                      <FileText size={20} />
                    </div>
                    <button
                      onClick={(e) => handleRestore(e, note.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                      title="Restore Note"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Updated {new Date(note.updated_at).toLocaleDateString()} at {new Date(note.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
