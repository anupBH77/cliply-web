export interface User {
  id: string | number;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Collection {
  id: string | number;
  name: string;
}

export interface Note {
  id: string | number;
  title: string;
  content: any; // Tiptap JSON content
  collection_id: string | number | null;
  created_at: string;
  updated_at: string;
}
