"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notesApi, tasksApi } from "../../lib/api";
import { Note, Task } from "../../types";
import { FileText, CheckSquare } from "lucide-react";
import { isToday, isTomorrow, format } from "date-fns";
import DashboardHeader from "./DashboardHeader";
import { useTheme } from "../../lib/ThemeContext";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    Promise.all([notesApi.getNotes(), tasksApi.getTasks()])
      .then(([notesData, tasksData]) => {
        // Sort by updated_at descending
        const sortedNotes = notesData.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNotes(sortedNotes);
        setTasks(tasksData);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredNotes = notes.filter(n => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (n.title || "").toLowerCase().includes(query);
  });

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .filter(t => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (t.title || "").toLowerCase().includes(query) || (t.description || "").toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 dark:bg-zinc-950`}>
      <DashboardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1 overflow-y-auto p-6 relative">
        <div className=" w-full mx-auto ">
          {isLoading ? (
            <div className="flex justify-center p-12 text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-zinc-900 dark:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">Total Notes</h3>
                    <p className="text-3xl font-bold text-zinc-600">{notes?.length}</p>
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">Upcoming Tasks</h3>
                    <p className="text-3xl font-bold text-zinc-600">{upcomingTasks?.length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className={`rounded-2xl border overflow-hidden shadow-sm flex flex-col h-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-zinc-800/50 bg-zinc-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                      <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Notes</h2>
                    </div>
                    <div className={`divide-y flex-1 ${isDarkMode ? 'divide-zinc-800/50' : 'divide-gray-100'}`}>
                      {filteredNotes.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          {searchQuery ? "No matching notes found." : "You haven't created any notes yet."}
                        </div>
                      ) : (
                        filteredNotes.slice(0, 5).map((note) => (
                          <div
                            key={note.id}
                            onClick={() => router.push(`/notes/${note.id}`)}
                            className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-zinc-900/30 text-zinc-400' : 'bg-zinc-50 text-zinc-500'
                                }`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{note.title || "Untitled Note"}</h4>
                                <p className="text-sm text-gray-500">
                                  Updated {new Date(note.updated_at).toLocaleDateString()} at {new Date(note.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className={`rounded-2xl border overflow-hidden shadow-sm flex flex-col h-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-zinc-800/50 bg-zinc-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                      <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Tasks</h2>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <div className={`divide-y flex-1 ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {upcomingTasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          {searchQuery ? "No matching tasks found." : "No upcoming tasks."}
                        </div>
                      ) : (
                        upcomingTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={task.status === "completed"}
                                onChange={async (e) => {
                                  e.stopPropagation();
                                  const newStatus = e.target.checked ? "completed" : "todo";
                                  try {
                                    await tasksApi.updateTask(task.id, { status: newStatus });
                                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="w-5 h-5 rounded border-gray-300 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 dark:ring-zinc-100 cursor-pointer"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{task.title}</h4>
                                  {task.priority && (
                                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${task.priority === "high" ? "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" :
                                      task.priority === "medium" ? "text-zinc-600 bg-zinc-100 dark:bg-zinc-900/30 dark:text-zinc-400" :
                                        "text-zinc-600 bg-zinc-100 dark:bg-zinc-900/30 dark:text-zinc-400"
                                      }`}>
                                      {task.priority}
                                    </span>
                                  )}
                                </div>
                                {task.due_date && (
                                  <p className={`text-xs mt-1 font-medium ${isToday(new Date(task.due_date)) ? 'text-red-500 dark:text-red-400' :
                                    isTomorrow(new Date(task.due_date)) ? 'text-zinc-500 dark:text-zinc-400' :
                                      'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {isToday(new Date(task.due_date)) ? 'Today' :
                                      isTomorrow(new Date(task.due_date)) ? 'Tomorrow' :
                                        format(new Date(task.due_date), "MMM d")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>


            </>
          )
          }
        </div>
      </div>
    </div>
  );
}
