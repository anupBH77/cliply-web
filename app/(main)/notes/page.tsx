"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { notesApi } from "../../../lib/api";
import { Note } from "../../../types";
import NotesHeader from "../../../components/notes/NotesHeader";
import { useTheme } from "../../../lib/ThemeContext";

export default function NotesIndexPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    notesApi.getNotes()
      .then((data) => {
        // Sort by updated_at descending
        const sortedNotes = data.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNotes(sortedNotes);
      })
      .catch((err) => console.error("Failed to load notes", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredNotes = notes.filter(n =>
    (n.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.content && JSON.stringify(n.content).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 dark:bg-zinc-950`}>
      <NotesHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1 overflow-y-auto  p-6 relative">
        <div className="w-full mx-auto">

          {isLoading ? (
            <div className="flex justify-center p-12 text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-zinc-900 dark:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900/30 rounded-2xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-6 shadow-sm border border-zinc-200 dark:border-zinc-900/50">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Create your first note.</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                Capture your thoughts, save important information, and organize your ideas with our AI-powered editor.
              </p>
              <Link
                href="/notes/new"
                className="flex items-center gap-2 bg-gradient-to-r from-zinc-900 transition-all dark:from-zinc-100 to-zinc-500 hover:from-zinc-700 hover:to-zinc-600 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium"
              >
                <Plus size={20} />
                <span>Create New Note</span>
              </Link>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No matching notes found for "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900/50 transition-colors">
                      <FileText size={20} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Updated {new Date(note.updated_at).toLocaleDateString()} at {new Date(note.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
