"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, Plus, ChevronDown, ChevronRight, Home, FileText, 
  MessageCircle, Database, CheckSquare, LayoutTemplate, Upload, 
  Archive, Trash, Folder, FolderOpen, Menu, PanelLeftClose, PanelLeftOpen, LogOut
} from "lucide-react";
import { collectionsApi } from "../lib/api";
import { Collection } from "../types";
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
  { name: "Tasks", icon: CheckSquare, href: "/dashboard/tasks" },
  { name: "Templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { name: "Uploads", icon: Upload, href: "/dashboard/uploads" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
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

  // Fetch Collections
  useEffect(() => {
    collectionsApi.getCollections().then(setCollections).catch(() => {
      // Mock for now
      setCollections([
        { id: "work", name: "Work" },
        { id: "personal", name: "Personal" },
        { id: "ideas", name: "Ideas" }
      ]);
    });
  }, []);

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
    const hasChildren = false; // Mocking no children for now
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
    <div className={`flex flex-col h-full bg-[#F9FAFB] text-[#111827] border-r border-[#E5E7EB] transition-all duration-300 ease-in-out ${
      isCollapsed ? "w-[80px]" : "w-[260px]"
    }`}>
      {/* Brand Section */}
      <div className={`p-6 flex items-center h-[88px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-[#7C3AED] shadow-sm border border-purple-100">
            <Sparkles size={20} />
          </div>
          {!isCollapsed && <span className="font-bold text-[20px] tracking-tight">Cliply</span>}
        </Link>
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="hidden md:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
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
                className={`flex items-center gap-3 h-10 rounded-[10px] transition-colors duration-200 ${
                  isActive 
                    ? "bg-[#F3F0FF] text-[#7C3AED] font-medium" 
                    : "text-[#6B7280] hover:bg-gray-200/50"
                } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={18} className={isActive ? "text-[#7C3AED]" : "text-gray-400"} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collections */}
        {!isCollapsed && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between px-3 group pt-6 border-t border-gray-200/60">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collections</h3>
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 transition-all">
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
            </div>
          </div>
        )}
      </div>

      {/* Bottom Utility Section */}
      <div className="px-3 py-3 flex flex-col gap-1 border-t border-[#E5E7EB]">
        <Link href="/dashboard/archive" className={`flex items-center gap-3 h-10 rounded-[10px] text-[#6B7280] hover:bg-gray-200/50 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`} title="Archive">
          <Archive size={18} className="text-gray-400" />
          {!isCollapsed && <span className="font-medium text-sm">Archive</span>}
        </Link>
        <Link href="/dashboard/trash" className={`flex items-center gap-3 h-10 rounded-[10px] text-[#6B7280] hover:bg-gray-200/50 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`} title="Trash">
          <Trash size={18} className="text-gray-400" />
          {!isCollapsed && <span className="font-medium text-sm">Trash</span>}
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 bg-[#F9FAFB]">
        <div className={`bg-white border border-[#E5E7EB] rounded-xl flex items-center transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden flex items-center justify-between">
              <div className="flex flex-col truncate pr-2">
                <span className="text-sm font-semibold text-[#111827] truncate">{user?.name || 'User'}</span>
                <span className="text-xs text-[#6B7280] truncate">{user?.email || 'user@example.com'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
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
