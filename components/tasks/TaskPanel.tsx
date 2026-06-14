import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Trash2, Loader2, Calendar, AlertCircle } from "lucide-react";
import { Task } from "@/types";
import { tasksApi } from "@/lib/api";

export default function TaskPanel({ task, onClose, onDeleteRequest }: { task: Task | null, onClose: () => void, onDeleteRequest: (id: string) => void }) {
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.split('T')[0] : "");

  // Animate slide-in state
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Task>) => isEditing
      ? tasksApi.updateTask(task.id, data)
      : tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleClose();
    }
  });

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // match animation duration
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Partial<Task> = {
      title,
      description,
      priority: priority as any,
    };

    if (dueDate) {
      payload.due_date = dueDate;
    } else {
      payload.due_date = null;
    }
    if (!isEditing) {
      payload.status = "todo";
    }

    saveMutation.mutate(payload);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      <div className={`fixed right-0 top-0 bottom-0 w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-200 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{isEditing ? "Edit Task" : "New Task"}</h2>
          <div className="flex items-center gap-1">
            {isEditing && (
              <button
                type="button"
                onClick={() => onDeleteRequest(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={handleClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="What needs to be done?"
                required
                disabled={saveMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none text-gray-900 dark:text-gray-100 min-h-[160px] resize-y transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Add details, notes, or subtasks..."
                disabled={saveMutation.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none text-gray-900 dark:text-gray-100 appearance-none transition-all"
                    disabled={saveMutation.isPending}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      // format "2026-06-17"
                      setDueDate(e.target.value)
                    }}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-all"
                    disabled={saveMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {isEditing && task.note_id && (
              <div className="mt-2 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 flex gap-3 items-start">
                <AlertCircle size={18} className="text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300">Linked Note</h4>
                  <p className="text-xs text-purple-700 dark:text-purple-400/80 mt-1">This task is attached to a note. You can view the note from the task board.</p>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors text-sm"
            disabled={saveMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
            disabled={saveMutation.isPending || !title.trim()}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </>
  );
}
