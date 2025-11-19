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
import { Task, Status, ColumnType, Priority } from '../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Search, Plus, Filter, Check } from 'lucide-react';
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

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

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
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 5 } // Prevents accidental drags on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on search term AND selected priorities
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = 
        selectedPriorities.length === 0 || 
        selectedPriorities.includes(t.priority);

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, selectedPriorities]);

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

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Kanban</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500 transition-colors text-zinc-300 placeholder-zinc-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border 
                    ${selectedPriorities.length > 0 
                        ? 'bg-zinc-700 border-zinc-500 text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                    }`}
            >
                <Filter size={16} />
                Filtro
                {selectedPriorities.length > 0 && (
                    <span className="ml-1 bg-indigo-500 text-white text-[10px] px-1.5 rounded-full">
                        {selectedPriorities.length}
                    </span>
                )}
            </button>

            {isFilterOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        <div className="p-2 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            Prioridade
                        </div>
                        {PRIORITIES.map((priority) => (
                            <button
                                key={priority}
                                onClick={() => togglePriority(priority)}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 flex items-center justify-between transition-colors"
                            >
                                <span className={selectedPriorities.includes(priority) ? 'text-white' : 'text-zinc-400'}>
                                    {priority}
                                </span>
                                {selectedPriorities.includes(priority) && (
                                    <Check size={14} className="text-indigo-500" />
                                )}
                            </button>
                        ))}
                        {selectedPriorities.length > 0 && (
                            <div className="p-2 border-t border-zinc-800">
                                <button 
                                    onClick={() => {
                                        setSelectedPriorities([]);
                                        setIsFilterOpen(false);
                                    }}
                                    className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 py-1"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
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