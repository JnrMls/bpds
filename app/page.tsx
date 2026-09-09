"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt:string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =useState("");

  useEffect(() => {
    fetch("/api/tasks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to retrieve tasks");
      }

      return response.json();
    })
    .then((data) => {
      setTasks(data);
      setLoading(false);
    })
    .catch(() => {
      setError("No se pudieron cargar las tareas");
      setLoading(false);
    });
  },[]);

  if (loading) {
    return  <p>Cargando tareas...</p>;
  }

  if(error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Lista de tareas</h1>

      {tasks.length === 0 ? (
        <p>No hay tareas disponibles</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>
                Estado: {task.completed ? "Completada" : "Pendiente"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
