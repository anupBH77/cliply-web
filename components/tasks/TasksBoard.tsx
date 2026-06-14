"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { tasksApi } from "@/lib/api";
import { Task, TaskStatus } from "@/types";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import TasksHeader from "./TasksHeader";
import TaskPanel from "./TaskPanel";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function TasksBoard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => tasksApi.updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old ? old.map((t: Task) => t.id === id ? { ...t, status } : t) : []
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const filteredTasks = tasks.filter((task: Task) => {
    if (statusFilter !== "All" && task.status !== statusFilter.toLowerCase().replace(" ", "_")) return false;
    if (priorityFilter !== "All" && task.priority !== priorityFilter.toLowerCase()) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) &&
        !(task.description || "").toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  const todoTasks = filteredTasks.filter((t: Task) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t: Task) => t.status === "in_progress");
  const completedTasks = filteredTasks.filter((t: Task) => t.status === "completed");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t: Task) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: implement if you want items to shift while dragging over different columns
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t: Task) => t.id === activeId);
    if (!activeTask) return;

    // Check if over a column or another task
    const overIsColumn = ['todo', 'in_progress', 'completed'].includes(overId);

    let newStatus = activeTask.status;

    if (overIsColumn) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t: Task) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (activeTask.status !== newStatus) {
      updateTaskStatusMutation.mutate({ id: activeId, status: newStatus });
    }
  };

  const openNewTaskPanel = () => {
    setEditingTask(null);
    setIsPanelOpen(true);
  };

  const openEditTaskPanel = (task: Task) => {
    setEditingTask(task);
    setIsPanelOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <TasksHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onNewTask={openNewTaskPanel}
      />

      <div className="flex-1 overflow-x-auto p-6 relative">
        {isLoading ? (
          <div className="flex gap-6 h-full items-start">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 min-w-[320px] max-w-[320px] h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 && !searchQuery && statusFilter === "All" && priorityFilter === "All" ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">No tasks yet</p>
            <p className="text-sm mb-6 max-w-md text-center">Capture actionable items, build out your board, and boost your productivity.</p>
            <button
              onClick={openNewTaskPanel}
              className="bg-[#7C3AED] hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Create First Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
            <p className="text-lg">No matching tasks found</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
              className="mt-4 text-[#7C3AED] hover:text-purple-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 h-full items-start">
              <TaskColumn id="todo" title="Todo" tasks={todoTasks} onEdit={openEditTaskPanel} />
              <TaskColumn id="in_progress" title="In Progress" tasks={inProgressTasks} onEdit={openEditTaskPanel} />
              <TaskColumn id="completed" title="Completed" tasks={completedTasks} onEdit={openEditTaskPanel} />
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {isPanelOpen && (
        <TaskPanel
          task={editingTask}
          onClose={() => setIsPanelOpen(false)}
          onDeleteRequest={(id) => setDeletingTaskId(id)}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmModal
          taskId={deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onSuccess={() => {
            setDeletingTaskId(null);
            setIsPanelOpen(false);
          }}
        />
      )}
    </div>
  );
}
