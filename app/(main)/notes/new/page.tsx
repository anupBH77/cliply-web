import React from "react";
import NoteEditor from "../../../../components/editor/NoteEditor";

interface NewNotePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  // Await the searchParams as required in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const collectionId = resolvedSearchParams.collectionId as string | undefined;

  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      <NoteEditor initialCollectionId={collectionId} />
    </div>
  );
}
