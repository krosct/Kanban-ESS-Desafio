import React, { useState, useMemo } from 'react';
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
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, Status, ColumnType } from '../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Search, Plus } from 'lucide-react';
import { NewTaskModal } from './NewTaskModal';

interface KanbanBoardProps {
  tasks: Task[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addTask: (task: Task) => void;
  moveTask: (id: string, status: Status) => void;
  reorderTasks: (tasks: Task[]) => void;
}

const COLUMNS: ColumnType[] = [
  { id: 'pending', title: 'Pendente', colorClass: 'text-white' },
  { id: 'doing', title: 'Realizando', colorClass: 'text-white' },
  { id: 'done', title: 'Concluída', colorClass: 'text-white' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  searchTerm,
  setSearchTerm,
  addTask,
  moveTask,
  reorderTasks,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 5 } // Prevents accidental drags on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the tasks
    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dropping over a column directly (empty column case)
    if (COLUMNS.some(col => col.id === overId)) {
        const newStatus = overId as Status;
        if (activeTask.status !== newStatus) {
            moveTask(activeId, newStatus);
        }
        return;
    }

    // If dropping over another task
    if (activeTask && overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
        setActiveId(null);
        return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (activeTask && overTask && activeTask.status === overTask.status && activeId !== overId) {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    setActiveId(null);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Kanban</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500 transition-colors text-zinc-300 placeholder-zinc-500"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-zinc-700"
          >
             <Plus size={16} />
             Nova atividade
          </button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Add Modal */}
      {isModalOpen && (
        <NewTaskModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={addTask} 
        />
      )}
    </div>
  );
};