"use client";

import React, { useState, useEffect, useRef } from "react";
import { Folder, ChevronDown, Plus, Check, X } from "lucide-react";
import { collectionsApi } from "../../lib/api";
import { Collection } from "../../types";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  collectionId: string | number | null;
  onCollectionChange: (id: string | number | null) => void;
  saveStatus: "Saving..." | "Saved" | "";
}

export default function EditorHeader({
  title,
  onTitleChange,
  collectionId,
  onCollectionChange,
  saveStatus,
}: EditorHeaderProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Attempt to load collections; ignore errors if backend isn't ready
    collectionsApi.getCollections().then(setCollections).catch(() => {
      // Mock collections for now to show UI working
      setCollections([
        { id: "work", name: "Work" },
        { id: "personal", name: "Personal" },
        { id: "ideas", name: "Ideas" }
      ]);
    });
  }, []);

  // Auto focus the input when creating starts
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateCollection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const newCollection = await collectionsApi.createCollection(newCollectionName.trim());
      setCollections([...collections, newCollection]);
      onCollectionChange(newCollection.id);
    } catch (error) {
      // Mock creation if backend is down
      const mockId = "mock-col-" + Date.now();
      const mockCollection = { id: mockId, name: newCollectionName.trim() };
      setCollections([...collections, mockCollection]);
      onCollectionChange(mockId);
    }
    
    setNewCollectionName("");
    setIsCreating(false);
    setIsDropdownOpen(false);
  };

  const activeCollection = collections.find(c => String(c.id) === String(collectionId));

  return (
    <div className="flex flex-col gap-4 mb-8 pt-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="relative">
          <button 
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsCreating(false);
              setNewCollectionName("");
            }}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
          >
            <Folder size={16} />
            <span>{activeCollection ? activeCollection.name : "No Collection"}</span>
            <ChevronDown size={14} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden flex flex-col max-h-80">
                <div className="overflow-y-auto flex-1">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!collectionId ? 'font-medium text-purple-600' : 'text-gray-700'}`}
                    onClick={() => { onCollectionChange(null); setIsDropdownOpen(false); }}
                  >
                    No Collection
                  </button>
                  {collections.map(c => (
                    <button
                      key={c.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${String(c.id) === String(collectionId) ? 'font-medium text-purple-600' : 'text-gray-700'}`}
                      onClick={() => { onCollectionChange(c.id); setIsDropdownOpen(false); }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 p-2">
                  {isCreating ? (
                    <form onSubmit={handleCreateCollection} className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 border border-purple-300 rounded px-2 py-1 bg-purple-50 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="Collection name"
                          className="bg-transparent border-none outline-none text-sm w-full py-0.5 text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => { setIsCreating(false); setNewCollectionName(""); }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <button
                          type="submit"
                          disabled={!newCollectionName.trim()}
                          className="flex items-center gap-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 px-2 py-1 rounded transition-colors"
                        >
                          <Check size={12} />
                          <span>Save</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <Plus size={14} />
                      <span className="font-medium">New Collection</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="text-gray-400 font-medium">
          {saveStatus}
        </div>
      </div>
      
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
        className="text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-300 w-full"
      />
    </div>
  );
}
