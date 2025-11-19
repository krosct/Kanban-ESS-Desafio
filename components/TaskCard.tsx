import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay }) => {
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine background color based on status to match screenshots
  const getBgColor = () => {
    switch (task.status) {
      case 'pending': return 'bg-[#ef4444]'; // red-500 equivalent
      case 'doing': return 'bg-[#6366f1]';   // indigo-500 equivalent
      case 'done': return 'bg-[#14b8a6]';    // teal-500 equivalent
      default: return 'bg-zinc-700';
    }
  };

  const handleCardClick = () => {
      if (!isDragging) {
        navigate(`/task/${task.id}`);
      }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`
        relative group p-5 rounded-lg cursor-grab active:cursor-grabbing
        shadow-lg text-white flex flex-col gap-2 min-h-[140px]
        transition-all hover:brightness-110
        ${getBgColor()}
        ${isOverlay ? 'rotate-2 scale-105 shadow-2xl z-50' : ''}
        ${isDragging ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <h3 className="font-bold text-lg leading-tight line-clamp-2">{task.title}</h3>
      
      <p className="text-white/80 text-sm line-clamp-3 flex-grow">
        {task.description}
      </p>

      <div className="mt-2">
        <span className="inline-block px-2 py-1 text-xs font-medium border border-white/30 rounded text-white">
            {task.priority}
        </span>
      </div>
    </div>
  );
};