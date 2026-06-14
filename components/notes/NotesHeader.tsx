import { Search, Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "../../lib/ThemeContext";
import Link from "next/link";

export default function NotesHeader({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string; 
  setSearchQuery: (q: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className={`border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4 flex-1">
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notes</h1>
        <div className="relative max-w-md w-full">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input 
            type="text"
            placeholder="Search notes..."
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

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link 
          href="/notes/new"
          className="flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={16} />
          New Note
        </Link>
      </div>
    </div>
  );
}
