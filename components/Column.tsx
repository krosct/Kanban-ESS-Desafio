import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, ColumnType } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-zinc-200">{column.title}</h2>
      
      <div
        ref={setNodeRef}
        className="bg-surface rounded-2xl p-4 min-h-[500px] border border-zinc-800 flex flex-col gap-3"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-600 italic text-sm">
                Arraste itens aqui
            </div>
        )}
      </div>
    </div>
  );
};