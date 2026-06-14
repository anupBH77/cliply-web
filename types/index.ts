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

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  note_id: string | null;
}
