import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

export default function TaskColumn({ id, title, tasks, onEdit }: { id: string, title: string, tasks: Task[], onEdit: (t: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-[320px] max-h-full flex-shrink-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl transition-colors ${isOver ? 'ring-2 ring-zinc-400 ring-inset bg-zinc-50/30 dark:bg-zinc-900/30' : ''}`}
    >
      <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
        <span className="text-sm tracking-wide">{title}</span>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium py-0.5 px-2 rounded-full">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-1 space-y-3 scrollbar-hide min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
