"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import EditorHeader from "./EditorHeader";
import Editor from "./Editor";
import { useAutoSave } from "./hooks/useAutoSave";
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
  // Handled by useAutoSave now
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

  const onSave = useCallback(async () => {
    const payload = {
      title: titleRef.current || "Untitled",
      content: contentRef.current || {},
      collection_id: collectionIdRef.current,
    };

    if (noteIdRef.current) {
      await notesApi.updateNote(noteIdRef.current, payload).catch((e) => {
        console.log("Mock saved", payload);
      });
    } else {
      if (!titleRef.current && (!contentRef.current || Object.keys(contentRef.current).length === 0)) {
        return;
      }
      const newNote = await notesApi.createNote(payload).catch((e) => {
        console.log("failed to create note", e);
        return { id: "" };
      });
      if (newNote.id) {
        setNoteId(newNote.id);
        router.replace(`/notes/${newNote.id}`);
      }
    }
  }, [router]);

  const { saveStatus, markUnsaved } = useAutoSave({ onSave, delay: 2000 });

  const handleArchive = async () => {
    if (!noteId) return;
    try {
      await notesApi.archiveNote(noteId);
      router.push("/notes");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;
    try {
      await notesApi.deleteNote(noteId);
      router.push("/notes");
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger auto-save on content/title changes
  useEffect(() => {
    // Skip initial empty states
    if (!title && !content && !noteId) return;
    markUnsaved();
  }, [title, content, collectionId, markUnsaved, noteId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-zinc-900 dark:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading note...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-6 pb-20 dark:bg-zinc-950">
      <EditorHeader
        title={title}
        onTitleChange={setTitle}
        collectionId={collectionId}
        onCollectionChange={setCollectionId}
        saveStatus={saveStatus as any}
        onArchive={handleArchive}
        onDelete={handleDelete}
        noteId={noteId}
      />
      <Editor
        initialContent={content}
        onChange={setContent}
      />
    </div>
  );
}
