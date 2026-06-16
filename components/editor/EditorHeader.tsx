"use client";

import React, { useState, useEffect, useRef } from "react";
import { Folder, ChevronDown, Plus, Check, X, MoreHorizontal, Archive, Trash } from "lucide-react";
import { collectionsApi } from "../../lib/api";
import { Collection } from "../../types";
import TitleInput from "./TitleInput";
import SaveStatus from "./SaveStatus";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  collectionId: string | number | null;
  onCollectionChange: (id: string | number | null) => void;
  saveStatus: "Saving..." | "Saved" | "";
  onArchive?: () => void;
  onDelete?: () => void;
  noteId?: string | number | null;
}

export default function EditorHeader({
  title,
  onTitleChange,
  collectionId,
  onCollectionChange,
  saveStatus,
  onArchive,
  onDelete,
  noteId,
}: EditorHeaderProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
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
    <div className="flex flex-col gap-4 mb-8 pt-4 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:bg-zinc-950">
        <div className="relative">
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsCreating(false);
              setNewCollectionName("");
            }}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-md transition-colors"
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
              <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1 overflow-hidden flex flex-col max-h-80">
                <div className="overflow-y-auto flex-1">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${!collectionId ? 'font-medium text-zinc-600 dark:text-zinc-400' : 'text-gray-700 dark:text-gray-200'}`}
                    onClick={() => { onCollectionChange(null); setIsDropdownOpen(false); }}
                  >
                    No Collection
                  </button>
                  {collections.map(c => (
                    <button
                      key={c.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${String(c.id) === String(collectionId) ? 'font-medium text-zinc-600 dark:text-zinc-400' : 'text-gray-700 dark:text-gray-200'}`}
                      onClick={() => { onCollectionChange(c.id); setIsDropdownOpen(false); }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                  {isCreating ? (
                    <form onSubmit={handleCreateCollection} className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 bg-zinc-50 dark:bg-zinc-900/30 focus-within:border-zinc-500 dark:focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-900">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="Collection name"
                          className="bg-transparent border-none outline-none text-sm w-full py-0.5 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => { setIsCreating(false); setNewCollectionName(""); }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <button
                          type="submit"
                          disabled={!newCollectionName.trim()}
                          className="flex items-center gap-1 text-xs font-medium text-white bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-300 px-2 py-1 rounded transition-colors"
                        >
                          <Check size={12} />
                          <span>Save</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 rounded-md transition-colors"
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

        <div className="flex items-center gap-4">
          <SaveStatus status={saveStatus as any} />

          {noteId && (
            <div className="relative">
              <button
                onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500"
              >
                <MoreHorizontal size={18} />
              </button>

              {isOptionsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOptionsMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1 overflow-hidden flex flex-col">
                    <button
                      onClick={() => {
                        setIsOptionsMenuOpen(false);
                        onArchive?.();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Archive size={14} className="text-gray-400" />
                      Archive
                    </button>
                    <button
                      onClick={() => {
                        setIsOptionsMenuOpen(false);
                        onDelete?.();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash size={14} className="text-red-400" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <TitleInput title={title} onChange={onTitleChange} />
    </div>
  );
}
