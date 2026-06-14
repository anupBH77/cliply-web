import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";
import { Loader2, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ taskId, onClose, onSuccess }: { taskId: string, onClose: () => void, onSuccess: () => void }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess();
    }
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Task</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors text-sm"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </button>
            <button 
              onClick={() => deleteMutation.mutate()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
