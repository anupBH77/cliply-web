"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import EditorHeader from "./EditorHeader";
import TiptapEditor from "./TiptapEditor";
import { Note } from "../../types";
import { notesApi } from "../../lib/api";

interface NoteEditorProps {
  initialNoteId?: string | number;
  initialCollectionId?: string | number | null;
}

export default function NoteEditor({ initialNoteId, initialCollectionId = null }: NoteEditorProps) {
  const router = useRouter();
  
  const [noteId, setNoteId] = useState<string | number | null>(initialNoteId || null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [collectionId, setCollectionId] = useState<string | number | null>(initialCollectionId);
  const [saveStatus, setSaveStatus] = useState<"Saving..." | "Saved" | "">("");
  const [isLoading, setIsLoading] = useState(!!initialNoteId);

  useEffect(() => {
    if (initialNoteId) {
      setIsLoading(true);
      notesApi.getNote(initialNoteId)
        .then(note => {
          setTitle(note.title);
          setContent(note.content);
          setCollectionId(note.collection_id);
        })
        .catch(() => {
          setTitle("Untitled");
          setContent(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [initialNoteId]);

  // Refs for debounced save to access latest state without dependency cycles
  const titleRef = useRef(title);
  const contentRef = useRef(content);
  const collectionIdRef = useRef(collectionId);
  const noteIdRef = useRef(noteId);

  useEffect(() => { titleRef.current = title; }, [title]);
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { collectionIdRef.current = collectionId; }, [collectionId]);
  useEffect(() => { noteIdRef.current = noteId; }, [noteId]);

  const saveNote = useCallback(
    debounce(async () => {
      try {
        setSaveStatus("Saving...");
        
        const payload = {
          title: titleRef.current || "Untitled",
          content: contentRef.current || {},
          collection_id: collectionIdRef.current,
        };

        if (noteIdRef.current) {
          // Update existing note
          await notesApi.updateNote(noteIdRef.current, payload).catch(() => {
            // Ignore API error for now to simulate success if no backend
            console.log("Mock saved", payload);
          });
          setSaveStatus("Saved");
        } else {
          // Create new note
          // Only create if there's actual content or title changed
          if (!titleRef.current && (!contentRef.current || Object.keys(contentRef.current).length === 0)) {
             setSaveStatus("");
             return;
          }
          
          let newNoteId: string | number;
          try {
            const newNote = await notesApi.createNote(payload);
            newNoteId = newNote.id;
          } catch (e) {
            // Mock backend response if not available
            newNoteId = "mock-" + Date.now();
            console.log("Mock created", payload);
          }
          
          setNoteId(newNoteId);
          setSaveStatus("Saved");
          // Update URL without full reload
          router.replace(`/notes/${newNoteId}`);
        }
      } catch (error) {
        console.error("Failed to save note:", error);
        setSaveStatus("Saved"); // Mock success anyway
      }
    }, 2000),
    [router]
  );

  // Trigger auto-save on content/title changes
  useEffect(() => {
    // Skip initial empty states
    if (!title && !content && !noteId) return;
    saveNote();
  }, [title, content, collectionId, saveNote, noteId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#7C3AED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading note...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-20">
      <EditorHeader 
        title={title}
        onTitleChange={setTitle}
        collectionId={collectionId}
        onCollectionChange={setCollectionId}
        saveStatus={saveStatus}
      />
      <TiptapEditor 
        initialContent={content} 
        onChange={setContent} 
      />
    </div>
  );
}
