import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, Status, Priority } from '../types';
import { ChevronDown, ArrowLeft, AlertTriangle } from 'lucide-react';

interface TaskDetailProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ tasks, updateTask, deleteTask }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Local state for edits
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  useEffect(() => {
    const found = tasks.find((t) => t.id === taskId);
    if (found) {
      setTask(found);
      setDescription(found.description);
      setTitle(found.title);
      setPriority(found.priority);
    } else {
      navigate('/');
    }
  }, [taskId, tasks, navigate]);

  if (!task) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    updateTask({ ...task, status: newStatus });
  };

  const handleSave = () => {
    if (task) {
        updateTask({ ...task, title, description, priority });
        setIsEditing(false);
    }
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    navigate('/');
  };

  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto min-h-screen">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Voltar ao Board
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        {isEditing ? (
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl md:text-5xl font-bold bg-transparent border-b border-zinc-600 focus:border-white focus:outline-none w-full md:w-1/2"
             />
        ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-white">{task.title}</h1>
        )}
        
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
           {/* Custom Select Mock */}
           <div className="relative">
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="appearance-none bg-transparent border border-zinc-600 rounded-lg px-4 py-2 pr-10 text-white min-w-[140px] focus:outline-none focus:border-zinc-400 cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <option value="pending" className="bg-zinc-900">Pendente</option>
                <option value="doing" className="bg-zinc-900">Realizando</option>
                <option value="done" className="bg-zinc-900">Concluída</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-zinc-400" size={16} />
           </div>

           <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
           >
            Deletar atividade
           </button>

           <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg font-medium border border-zinc-700 transition-colors"
           >
            {isEditing ? 'Salvar alterações' : 'Editar informações'}
           </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col gap-2 mb-8">
        <label className="text-lg font-medium text-zinc-200">Descrição</label>
        <div className="w-full">
          {isEditing ? (
             <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-64 bg-transparent border border-zinc-600 rounded-lg p-4 text-zinc-300 focus:outline-none focus:border-zinc-400 resize-none text-lg leading-relaxed"
             />
          ) : (
            <div className="w-full min-h-[200px] border border-zinc-600 rounded-lg p-4 text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">
                {description}
            </div>
          )}
        </div>
      </div>

      {/* Priority Section */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium text-zinc-200">Prioridade</label>
        <div className="w-full md:w-1/4">
            <div className="relative">
                <select
                    disabled={!isEditing}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className={`w-full appearance-none bg-transparent border rounded-lg px-4 py-2 pr-10 focus:outline-none transition-colors
                        ${isEditing 
                            ? 'border-zinc-600 text-zinc-300 focus:border-zinc-400 cursor-pointer' 
                            : 'border-zinc-700 text-zinc-500 cursor-not-allowed'
                        }
                    `}
                >
                    <option value="High" className="bg-zinc-900">High</option>
                    <option value="Medium" className="bg-zinc-900">Medium</option>
                    <option value="Low" className="bg-zinc-900">Low</option>
                </select>
                <ChevronDown 
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none 
                        ${isEditing ? 'text-zinc-400' : 'text-zinc-600'}
                    `} 
                    size={16} 
                />
            </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-zinc-300 mb-6 leading-relaxed">
              Tem certeza que deseja excluir a atividade <span className="font-bold text-white">"{task.title}"</span>? 
              <br />
              Esta ação é irreversível.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};