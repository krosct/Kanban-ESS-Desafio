import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Task, Status } from './types';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskDetail } from './components/TaskDetail';

// Initial Mock Data focusing on Safety/Women/Exchange context
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Pesquisar acomodação segura',
    description: 'Verificar bairros com boa iluminação e avaliações de outras mulheres intercambistas.',
    status: 'pending',
    priority: 'High',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Contatos de emergência',
    description: 'Criar lista com consulado, polícia local e grupos de apoio a mulheres na cidade de destino.',
    status: 'pending',
    priority: 'High',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Seguro Saúde Mulher',
    description: 'Contratar seguro que cubra exames de rotina e emergências ginecológicas no exterior.',
    status: 'doing',
    priority: 'Medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Documentação do Visto',
    description: 'Revisar e digitalizar todos os documentos necessários para a imigração.',
    status: 'done',
    priority: 'Low',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  // State initialization with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kanban-tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // CRUD Operations
  const addTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-doing selection:text-white">
        <Routes>
          <Route
            path="/"
            element={
              <KanbanBoard
                tasks={tasks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                addTask={addTask}
                moveTask={moveTask}
                reorderTasks={reorderTasks}
              />
            }
          />
          <Route
            path="/task/:taskId"
            element={
              <TaskDetail
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}