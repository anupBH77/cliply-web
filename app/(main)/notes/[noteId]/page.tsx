import React from "react";
import NoteEditor from "../../../../components/editor/NoteEditor";

interface NotePageProps {
  params: Promise<{ noteId: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  // Await the params as required in Next.js 15+
  const resolvedParams = await params;
  const { noteId } = resolvedParams;

  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      <NoteEditor initialNoteId={noteId} />
    </div>
  );
}
