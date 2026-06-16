import React from "react";
import NoteEditor from "../../../../components/editor/NoteEditor";
import { useTheme } from "@/lib/ThemeContext";

interface NewNotePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  // Await the searchParams as required in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const collectionId = resolvedSearchParams.collectionId as string | undefined;

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 dark:bg-zinc-950`}>

      <NoteEditor initialCollectionId={collectionId} />
    </div>
  );
}
