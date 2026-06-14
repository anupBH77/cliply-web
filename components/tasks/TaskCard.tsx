import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "@/types";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { Calendar, FileText, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TaskCard({ task, onEdit, isOverlay = false }: { task: Task, onEdit?: () => void, isOverlay?: boolean }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isOverlay });

  const updateStatusMutation = useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.updateTask(task.id, { status }),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old ? old.map(t => t.id === task.id ? { ...t, status: newStatus } : t) : []
      );
      return { previousTasks };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // prevent edit modal
    const newStatus = e.target.checked ? "completed" : "todo";
    updateStatusMutation.mutate(newStatus);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-400';
      case 'medium': return 'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-900/50 dark:text-orange-400';
      case 'low': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-900/50 dark:text-blue-400';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const renderDueDate = () => {
    if (!task.due_date) return null;
    const date = parseISO(task.due_date);
    let label = format(date, "MMM d");
    let colorClass = "text-gray-500";
    let Icon = Calendar;

    if (isPast(date) && !isToday(date) && task.status !== "completed") {
      label = "Overdue";
      colorClass = "text-red-600 font-medium";
      Icon = AlertCircle;
    } else if (isToday(date)) {
      label = "Today";
      colorClass = "text-[#7C3AED] font-medium";
    } else if (isTomorrow(date)) {
      label = "Tomorrow";
    }

    return (
      <div className={`flex items-center gap-1 text-[11px] ${colorClass}`}>
        <Icon size={12} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 border rounded-xl p-3.5 cursor-pointer transition-all group relative
        ${isDragging ? 'opacity-50 ring-2 ring-[#7C3AED] border-transparent shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-[#7C3AED]/30 dark:hover:border-[#7C3AED]/50'}
        ${isOverlay ? 'shadow-xl scale-[1.02] rotate-2 cursor-grabbing z-50' : ''}
      `}
      onClick={onEdit}
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-2.5 items-start mb-2">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={handleCheckboxChange}
          onPointerDown={(e) => e.stopPropagation()} // stop drag on checkbox
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
        />
        <div className="flex-1">
          <h4 className={`font-medium text-sm leading-snug ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {task.title}
          </h4>
        </div>
      </div>

      {task.description && (
        <p className={`text-xs line-clamp-2 mb-3 ml-6.5 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-500'}`}>
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 ml-6.5">
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {renderDueDate()}
        </div>

        {task.note_id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/notes/${task.note_id}`);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-[#7C3AED] transition-colors p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30"
            title="Linked Note"
          >
            <FileText size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
