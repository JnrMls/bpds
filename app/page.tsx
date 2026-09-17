'use client';

import { useState, useEffect } from 'react';

// Estructura de la tarea activa en el sistema
type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
};

// 1 y 2. Estructura requerida para almacenar la tarea eliminada (Persona 1)
type DeletedTask = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Lista donde se almacenarán las tareas eliminadas
  const [tareasEliminadas, setTareasEliminadas] = useState<DeletedTask[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar lista de tareas desde la API
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        setError('No se pudieron cargar las tareas');
      }
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

  // Actualizar tarea
  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: editTitle.trim(),
          description: editDescription,
          completed: false,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
        fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo actualizar la tarea');
      }
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
    }
  };

  // Crear tarea con Enter
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim() !== '') {
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: '' }),
        });

        if (res.ok) {
          setTitle('');
          setIsCreating(false);
          fetchTasks();
        }
      } catch (err) {
        console.error('Error al guardar la tarea:', err);
      }
    }
  };

  // Cambiar estado completada/pendiente
  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });

      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Error al cambiar el estado:', err);
    }
  };

  // 3. Lógica para eliminar de la API y guardar la tarea en tareasEliminadas (Persona 1)
  const handleDelete = async (id: string) => {
    const tareaAEliminar = tasks.find((t) => t.id === id);

    if (!tareaAEliminar) return;

    const confirmado = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    if (!confirmado) return;

    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Guardar los 5 datos requeridos en la lista de eliminadas
        const nuevaTareaEliminada: DeletedTask = {
          id: tareaAEliminar.id,
          titulo: tareaAEliminar.title,
          descripcion: tareaAEliminar.description || 'Sin descripción',
          estado: tareaAEliminar.completed ? 'Completada' : 'Pendiente',
          fechaCreacion: tareaAEliminar.createdAt
            ? new Date(tareaAEliminar.createdAt).toLocaleDateString('es-CO')
            : new Date().toLocaleDateString('es-CO'),
        };

        setTareasEliminadas((prev) => [...prev, nuevaTareaEliminada]);
        fetchTasks();
      } else {
        let errorMsg = 'No se pudo eliminar la tarea';
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch {
          // Ignorar si no viene formato json
        }
        alert(errorMsg);
      }
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
    }
  };

  if (loading) return <p className="p-8">Cargando tareas...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <main className="min-h-screen w-full bg-white dark:bg-slate-900 p-8 max-w-4xl mx-auto transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Gestor de Tareas</h1>

      {/* Formulario de creación rápida */}
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
            onBlur={() => setIsCreating(false)}
            className="border-b-2 border-blue-500 bg-transparent py-2 w-full text-black dark:text-white outline-none text-lg"
          />
        )}
      </div>

      {/* Tareas Activas */}
      <div className="space-y-3 mb-12">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tareas Agregadas</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No hay tareas creadas todavía.</p>
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
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border rounded p-2 w-full text-black"
                    placeholder="Descripción"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(task.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-300 text-black rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-blue-500"
                      />
                      <p
                        className={`font-medium transition-all ${
                          task.completed
                            ? 'line-through text-gray-400 dark:text-gray-600'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                        }}
                        className="px-3 py-1 bg-gray-200 text-black rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {task.description}
                    </p>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Estado: {task.completed ? 'Completada' : 'Pendiente'}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. Consulta visual de Tareas Eliminadas (Persona 1) */}
      <div className="border-t border-gray-300 dark:border-zinc-700 pt-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
          Tareas Eliminadas
        </h2>

        {tareasEliminadas.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500">No hay tareas eliminadas.</p>
        ) : (
          <div className="space-y-4">
            {tareasEliminadas.map((tarea, index) => (
              <div
                key={`${tarea.id}-${index}`}
                className="border border-red-200 bg-red-50 dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-4 text-black dark:text-white"
              >
                <p><strong>ID:</strong> {tarea.id}</p>
                <p><strong>Título:</strong> {tarea.titulo}</p>
                <p><strong>Descripción:</strong> {tarea.descripcion}</p>
                <p><strong>Estado:</strong> {tarea.estado}</p>
                <p><strong>Fecha de creación:</strong> {tarea.fechaCreacion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
    </main>
  );
}