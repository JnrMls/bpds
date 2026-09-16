"use client";

import { useState } from "react";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
};

export default function Home() {
  const [tareasEliminadas, setTareasEliminadas] = useState<Tarea[]>([]);

  const tarea: Tarea = {
    id: 1,
    titulo: "Tarea de programación",
    descripcion: "Realizar el trabajo de programación",
    estado: "Completada",
    fechaCreacion: new Date().toLocaleDateString("es-CO"),
  };

  const handleDelete = () => {
    const confirmado = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tarea?"
    );

    if (confirmado) {
      setTareasEliminadas((anteriores) => {
        return [...anteriores, tarea];
      });

      alert("¡Tarea eliminada y guardada correctamente!");
    } else {
      console.log("Acción de eliminación cancelada.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">
        Tareas
      </h1>

      <div className="border border-gray-500 rounded p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Tarea actual
        </h2>

        <p>ID: {tarea.id}</p>
        <p>Título: {tarea.titulo}</p>
        <p>Descripción: {tarea.descripcion}</p>
        <p>Estado: {tarea.estado}</p>
        <p>Fecha de creación: {tarea.fechaCreacion}</p>

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded mt-4"
        >
          Eliminar tarea
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Tareas eliminadas
      </h2>

      {tareasEliminadas.length === 0 ? (
        <p>No hay tareas eliminadas.</p>
      ) : (
        <div className="w-full max-w-lg">
          {tareasEliminadas.map((tareaEliminada, index) => (
            <div
              key={index}
              className="border border-gray-500 rounded p-4 mb-4"
            >
              <p>ID: {tareaEliminada.id}</p>
              <p>Título: {tareaEliminada.titulo}</p>
              <p>
                Descripción: {tareaEliminada.descripcion}
              </p>
              <p>Estado: {tareaEliminada.estado}</p>
              <p>
                Fecha de creación: {tareaEliminada.fechaCreacion}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}