const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
  });
};

export const authApi = {
  login: async (credentials: Record<string, string>) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Try to parse JSON, if it fails, return null or handle it
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  },

  register: async (userData: Record<string, string>) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("OTP verification failed");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  },

  getMe: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  },

  logout: async () => {
    // Optionally hit a backend endpoint to clear the cookie, or just clear local state.
    // Assuming backend has /auth/logout if needed, otherwise just returning true.
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
      method: "POST"
    }).catch(() => null); // Ignore errors on logout
    return true;
  }
};

import { Note, Collection, Task } from "../types";

export const notesApi = {
  getNotes: async (): Promise<Note[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes`);
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },
  getNote: async (id: string | number): Promise<Note> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch note");
    return response.json();
  },
  createNote: async (data: Partial<Note>): Promise<Note> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create note");
    return response.json();
  },
  updateNote: async (id: string | number, data: Partial<Note>): Promise<Note> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}`, {
      method: "PATCH", // or PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update note");
    return response.json();
  },
  deleteNote: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete note");
  },
  archiveNote: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}/archive`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to archive note");
  },
  unarchiveNote: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}/unarchive`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to unarchive note");
  },
  restoreNote: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes/${id}/restore`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to restore note");
  },
  getArchivedNotes: async (): Promise<Note[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes?archived=true`);
    if (!response.ok) throw new Error("Failed to fetch archived notes");
    return response.json();
  },
  getDeletedNotes: async (): Promise<Note[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/notes?deleted=true`);
    if (!response.ok) throw new Error("Failed to fetch deleted notes");
    return response.json();
  },
};

export const collectionsApi = {
  getCollections: async (): Promise<Collection[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/collections/`);
    if (!response.ok) throw new Error("Failed to fetch collections");
    return response.json();
  },
  createCollection: async (name: string): Promise<Collection> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/collections/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create collection");
    return response.json();
  },
  deleteCollection: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/collections/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete collection");
  },
};

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },
  getTask: async (id: string | number): Promise<Task> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) throw new Error("Failed to fetch task");
    return response.json();
  },
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },
  updateTask: async (id: string | number, data: Partial<Task>): Promise<Task> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  deleteTask: async (id: string | number): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },
};
