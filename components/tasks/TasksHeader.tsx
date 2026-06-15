import { Plus, Search } from "lucide-react";
import { useTheme } from "../../lib/ThemeContext";

export default function TasksHeader({ 
  searchQuery, setSearchQuery, 
  statusFilter, setStatusFilter, 
  priorityFilter, setPriorityFilter, 
  onNewTask 
}: any) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className={`border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tasks</h1>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input 
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all w-64 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`border rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option>All</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        
        <select 
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={`border rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>



        <button 
          onClick={onNewTask}
          className="flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>
    </div>
  );
}
