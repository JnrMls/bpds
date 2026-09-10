"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener las tareas
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to retrieve tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (error) {
      setError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Crear una tarea al presionar Enter
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && title.trim() !== "") {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description: "",
          }),
        });

        if (response.ok) {
          setTitle("");
          setIsCreating(false);
          fetchTasks();
        }
      } catch (error) {
        console.error("Error al guardar la tarea:", error);
      }
    }
  };

  // Eliminar una tarea
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tarea?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      fetchTasks();
    } catch (error) {
      setError("No se pudo eliminar la tarea");
    }
  };

  if (loading) {
    return <p>Cargando tareas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Gestor de Tareas
      </h1>

      {/* Crear una nueva tarea */}
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

      {/* Lista de tareas */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Tareas Agregadas
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No hay tareas creadas todavía.
          </p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
              >
                <h3 className="font-medium text-black dark:text-white">
                  {task.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>

                <p className="text-gray-600 dark:text-gray-400">
                  Estado:{" "}
                  {task.completed ? "Completada" : "Pendiente"}
                </p>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}