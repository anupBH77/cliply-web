import React from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { collectionsApi, notesApi } from "../../../../lib/api";

interface CollectionPageProps {
  params: Promise<{ collectionId: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const { collectionId } = resolvedParams;

  let notes: any[] = [];
  let collectionName = "Collection";

  try {
    const allNotes = await notesApi.getNotes();
    notes = allNotes.filter(n => String(n.collection_id) === String(collectionId));
    
    const collections = await collectionsApi.getCollections();
    const c = collections.find(col => String(col.id) === String(collectionId));
    if (c) collectionName = c.name;
  } catch (error) {
    // Mock notes for now if backend is down
    notes = [
      { id: "1", title: "Mock Note 1", updated_at: new Date().toISOString() },
      { id: "2", title: "Mock Note 2", updated_at: new Date().toISOString() },
    ];
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pt-20 md:pt-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{collectionName}</h1>
        <Link 
          href={`/notes/new?collectionId=${collectionId}`}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Note</span>
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FileText size={48} className="mb-4 text-gray-300" />
          <p className="text-lg mb-4">No notes in this collection yet.</p>
          <Link 
            href={`/notes/new?collectionId=${collectionId}`}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <Link 
              key={note.id} 
              href={`/notes/${note.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <FileText size={20} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 truncate">
                {note.title || "Untitled"}
              </h3>
              <p className="text-xs text-gray-400">
                Updated {new Date(note.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
