"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, Plus, ChevronDown, ChevronRight, Home, FileText, 
  MessageCircle, Database, CheckSquare, LayoutTemplate, Upload, 
  Archive, Trash, Folder, FolderOpen, Menu, PanelLeftClose, PanelLeftOpen, LogOut
} from "lucide-react";
import { collectionsApi, notesApi } from "../lib/api";
import { Collection, Note } from "../types";
import { useAuth } from "../lib/AuthContext";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Notes", icon: FileText, href: "/notes" },
  { name: "AI Chat", icon: MessageCircle, href: "/dashboard/chat" },
  { name: "Knowledge Base", icon: Database, href: "/dashboard/knowledge" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "Templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { name: "Uploads", icon: Upload, href: "/dashboard/uploads" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const { user, logout } = useAuth();
  
  // Responsive handling for tablet collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Collections and Notes
  const fetchData = async () => {
    try {
      const [colls, allNotes] = await Promise.all([
        collectionsApi.getCollections(),
        notesApi.getNotes()
      ]);
      setCollections(colls);
      setNotes(allNotes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCollectionSubmit = async (e: React.KeyboardEvent | React.FocusEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    if (!newCollectionName.trim()) {
      setIsCreatingCollection(false);
      return;
    }
    try {
      const newCollection = await collectionsApi.createCollection(newCollectionName.trim());
      setCollections(prev => [...prev, newCollection]);
      setExpandedFolders(prev => ({ ...prev, [String(newCollection.id)]: true }));
    } catch (error) {
      console.error("Failed to create collection", error);
    }
    setNewCollectionName("");
    setIsCreatingCollection(false);
  };

  // Simple flat collection structure for now as API returns Array<Collection>
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolder = (folder: Collection, level = 0) => {
    const folderIdStr = String(folder.id);
    const isExpanded = expandedFolders[folderIdStr];
    const folderNotes = notes.filter(n => String(n.collection_id) === folderIdStr);
    const hasChildren = folderNotes.length > 0;
    const isActive = pathname.includes(`/collections/${folderIdStr}`);

    return (
      <div key={folder.id}>
        <div 
          onClick={() => router.push(`/collections/${folder.id}`)}
          className={`flex items-center gap-2 py-[6px] rounded-[10px] cursor-pointer transition-colors duration-200 text-sm group ${
            isActive ? "bg-[#F3F0FF] text-[#7C3AED]" : "text-[#6B7280] hover:bg-gray-100"
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px`, paddingRight: '12px' }}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => toggleFolder(folderIdStr, e)} 
              className="p-0.5 hover:bg-gray-200 rounded text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-[18px]" /> // spacer for alignment
          )}
          
          {isExpanded && hasChildren ? (
            <FolderOpen size={16} className={isActive ? "text-[#7C3AED]" : "text-gray-400"} />
          ) : (
            <Folder size={16} className={isActive ? "text-[#7C3AED]" : "text-gray-400"} />
          )}
          
          <span className="truncate font-medium">{folder.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            {folderNotes.map(note => {
              const isNoteActive = pathname === `/notes/${note.id}`;
              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={`flex items-center gap-2 py-[6px] rounded-[10px] cursor-pointer transition-colors duration-200 text-sm ${
                    isNoteActive ? "bg-[#F3F0FF] text-[#7C3AED]" : "text-[#6B7280] hover:bg-gray-100"
                  }`}
                  style={{ paddingLeft: `${level * 16 + 12 + 26}px`, paddingRight: '12px' }}
                >
                  <FileText size={14} className={isNoteActive ? "text-[#7C3AED]" : "text-gray-400"} />
                  <span className="truncate">{note.title || "Untitled"}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    );
  };

  const handleNewNote = () => {
    router.push('/notes/new');
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full transition-colors duration-300 ease-in-out border-r ${
      isCollapsed ? "w-[80px]" : "w-[260px]"
    } bg-[#F9FAFB] dark:bg-gray-900 text-[#111827] dark:text-gray-100 border-[#E5E7EB] dark:border-gray-800`}>
      {/* Brand Section */}
      <div className={`p-6 flex items-center h-[88px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg mr-3 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Folder size={18} />
          </div>
          {!isCollapsed && <span className="font-medium text-[15px] truncate dark:text-gray-200">Collections</span>}
        </Link>
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="hidden md:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col gap-6 px-3 pb-4">
        {/* Primary CTA */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={handleNewNote}
              className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-purple-500 rounded-xl text-white flex items-center justify-center hover:brightness-110 transition-all duration-200 shadow-sm"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          ) : (
            <button 
              onClick={handleNewNote}
              className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-purple-500 rounded-xl text-white font-medium flex items-center justify-between px-4 hover:brightness-110 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Plus size={20} />
                <span>New Note</span>
              </div>
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && item.href !== '/' || (pathname === '/' && item.href === '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-purple-50 text-[#7C3AED] dark:bg-purple-900/20 dark:text-purple-400 shadow-[0_1px_2px_rgba(124,58,237,0.05)]" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#7C3AED] rounded-r-full" />
                )}
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive 
                    ? "bg-purple-100 text-[#7C3AED] dark:bg-purple-900/50 dark:text-purple-400" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-[#7C3AED] dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
                }`}>
                  <item.icon size={18} />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collections */}
        {!isCollapsed && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between px-3 group pt-6 border-t border-gray-200/60 dark:border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collections</h3>
              <button 
                onClick={() => setIsCreatingCollection(true)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-500 transition-all"
                title="Create Collection"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {collections.length > 0 ? (
                collections.map(folder => renderFolder(folder))
              ) : (
                <div className="px-3 text-xs text-gray-400 italic py-2">
                  Create your first collection.
                </div>
              )}
              {isCreatingCollection && (
                <div className="px-3 py-1 flex items-center gap-2">
                  <Folder size={16} className="text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={handleCreateCollectionSubmit}
                    onBlur={handleCreateCollectionSubmit}
                    className="w-full text-sm pl-3 pr-2 py-1.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900/50 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-gray-200 placeholder-gray-400"
                    placeholder="Collection name..."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Utility Section */}
      <div className="px-3 py-3 flex flex-col gap-1 border-t border-[#E5E7EB] dark:border-gray-800">
        <Link href="/dashboard/archive" className={`flex items-center gap-3 h-10 rounded-[10px] text-[#6B7280] dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`} title="Archive">
          <Archive size={18} className="text-gray-400" />
          {!isCollapsed && <span className="font-medium text-sm">Archive</span>}
        </Link>
        <Link href="/dashboard/trash" className={`flex items-center gap-3 h-10 rounded-[10px] text-[#6B7280] dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`} title="Trash">
          <Trash size={18} className="text-gray-400" />
          {!isCollapsed && <span className="font-medium text-sm">Trash</span>}
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 bg-[#F9FAFB] dark:bg-gray-900">
        <div className={`bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-800 rounded-xl flex items-center transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden flex items-center justify-between">
              <div className="flex flex-col truncate pr-2">
                <span className="text-sm font-semibold text-[#111827] dark:text-gray-200 truncate">{user?.name || 'User'}</span>
                <span className="text-xs text-[#6B7280] dark:text-gray-500 truncate">{user?.email || 'user@example.com'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-purple-100 text-purple-600 dark:hover:bg-purple-900/50 dark:text-purple-400 rounded-lg transition-colors ml-auto"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Toggle & Collapsed Expand Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm text-gray-600"
        >
          <Menu size={20} />
        </button>
      </div>
      
      {isCollapsed && (
        <div className="hidden md:flex fixed top-6 left-6 z-40">
           <button 
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block h-screen flex-shrink-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
