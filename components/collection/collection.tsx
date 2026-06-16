"use client"
import { useEffect, useState } from "react";
import { notesApi, collectionsApi } from "../../lib/api";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default function Collection({ collectionId }: { collectionId: string }) {
    const [notes, setNotes] = useState<any[]>([]);
    const [collectionName, setCollectionName] = useState<string>("Collection");

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                const allNotes = await notesApi.getNotes();
                setNotes(allNotes.filter(n => String(n.collection_id) === String(collectionId)));

                const collections = await collectionsApi.getCollections();
                const c = collections.find(col => String(col.id) === String(collectionId));
                if (c) setCollectionName(c.name);
            } catch (error) {
                console.log(error)
                setNotes([])
            }
        };
        fetchCollectionData();
    }, [collectionId]);

    return (
        <div className="p-8 mx-auto w-full dark:bg-zinc-950 pt-20 md:pt-8 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{collectionName}</h1>
                <Link
                    href={`/notes/new?collectionId=${collectionId}`}
                    className="flex items-center gap-2 dark:bg-white dark:text-black bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>New Note</span>
                </Link>
            </div>

            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                    <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg mb-4">No notes in this collection yet.</p>
                    <Link
                        href={`/notes/new?collectionId=${collectionId}`}
                        className="text-zinc-600 hover:text-zinc-700 font-medium"
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
                            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900/50 transition-colors">
                                    <FileText size={20} />
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                                {note.title || "Untitled"}
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Updated {new Date(note.updated_at || Date.now()).toLocaleDateString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}


