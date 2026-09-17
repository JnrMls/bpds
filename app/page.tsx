'use client';

import { useEffect, useState } from 'react';

// Estructura de una tarea
type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
};

// Estructura de una tarea eliminada
type DeletedTask = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([]);

  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar tareas desde la API
  const fetchTasks = async () => {
    try {
      setError('');

      const res = await fetch('/api/tasks');

      if (!res.ok) {
        throw new Error('No se pudieron cargar las tareas');
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      setError('No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Crear tarea con Enter
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== 'Enter' || !title.trim()) {
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: '',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'No se pudo crear la tarea');
        return;
      }

      setTitle('');
      setIsCreating(false);
      await fetchTasks();
    } catch (err) {
      console.error('Error al guardar la tarea:', err);
      alert('No se pudo crear la tarea');
    }
  };

  // Actualizar tarea
  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: editTitle.trim(),
          description: editDescription,
          completed: task.completed,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'No se pudo actualizar la tarea');
        return;
      }

      setEditingId(null);
      setEditTitle('');
      setEditDescription('');

      await fetchTasks();
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      alert('No se pudo actualizar la tarea');
    }
  };

  // Cambiar estado completada/pendiente
  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'No se pudo cambiar el estado');
        return;
      }

      await fetchTasks();
    } catch (err) {
      console.error('Error al cambiar el estado:', err);
    }
  };

  // Eliminar tarea
  const handleDelete = async (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);

    if (!taskToDelete) {
      return;
    }

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta tarea?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let errorMsg = 'No se pudo eliminar la tarea';

        try {
          const data = await res.json();

          if (data?.error) {
            errorMsg = data.error;
          }
        } catch {
          // La API no devolvió JSON
        }

        alert(errorMsg);
        return;
      }

      // Guardamos una copia local de la tarea eliminada
      const deletedTask: DeletedTask = {
        id: taskToDelete.id,
        title: taskToDelete.title,
        description:
          taskToDelete.description || 'Sin descripción',
        completed: taskToDelete.completed,
        createdAt: taskToDelete.createdAt,
      };

      setDeletedTasks((prev) => [...prev, deletedTask]);

      await fetchTasks();
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
      alert('Ocurrió un error al eliminar la tarea');
    }
  };

  // Formatear fecha
  const formatDate = (date?: string) => {
    if (!date) {
      return 'Fecha no disponible';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Fecha no disponible';
    }

    return parsedDate.toLocaleDateString('es-CO');
  };

  if (loading) {
    return <p className="p-8">Cargando tareas...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  return (
    <main className="min-h-screen w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Gestor de Tareas
      </h1>

      {/* Crear tarea */}
      <div className="mb-8">
        {!isCreating ? (
          <p
            onDoubleClick={() => setIsCreating(true)}
            className="text-gray-400 dark:text-gray-500 italic cursor-pointer select-none py-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Doble clic para añadir una nueva tarea (escribe y dale Enter)...
          </p>
        ) : (
          <input
            type="text"
            autoFocus
            placeholder="Escribe tu tarea para hacer y dale Enter..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!title.trim()) {
                setIsCreating(false);
              }
            }}
            className="border-b-2 border-blue-500 bg-transparent py-2 w-full text-black dark:text-white outline-none text-lg"
          />
        )}
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-gray-200 dark:border-zinc-700 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'active'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Tareas Agregadas
        </button>

        <button
          onClick={() => setActiveTab('deleted')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'deleted'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Tareas Eliminadas
        </button>
      </div>

      {/* Tareas activas */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No hay tareas creadas todavía.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
              >
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border rounded p-2 w-full text-black"
                      placeholder="Título de la tarea"
                    />

                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(e.target.value)
                      }
                      className="border rounded p-2 w-full text-black"
                      placeholder="Descripción"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(task.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle('');
                          setEditDescription('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            handleToggleComplete(task)
                          }
                          className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-blue-500"
                        />

                        <p
                          onDoubleClick={() => {
                            setEditingId(task.id);
                            setEditTitle(task.title);
                            setEditDescription(task.description);
                          }}
                          className={`font-medium cursor-pointer select-none ${
                            task.completed
                              ? 'line-through text-gray-400 dark:text-gray-600'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {task.description}
                      </p>
                    )}

                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Estado:{' '}
                      {task.completed
                        ? 'Completada'
                        : 'Pendiente'}
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tareas eliminadas */}
      {activeTab === 'deleted' && (
        <div className="space-y-4">
          {deletedTasks.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No hay tareas eliminadas todavía.
            </p>
          ) : (
            deletedTasks.map((task, index) => (
              <div
                key={`${task.id}-${index}`}
                className="border border-red-200 bg-red-50 dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-4 text-black dark:text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>🗑️</span>

                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {task.title}
                    </p>
                  </div>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Eliminada
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Descripción:</strong>{' '}
                  {task.description}
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Estado:</strong>{' '}
                  {task.completed
                    ? 'Completada'
                    : 'Pendiente'}
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Fecha de creación:</strong>{' '}
                  {formatDate(task.createdAt)}
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  <strong>ID:</strong> {task.id}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
