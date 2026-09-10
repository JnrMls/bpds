'use client';

import {useState} from 'react';
import {Task} from '@/models/Task';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleToggleComplete = async (id: string) => {
    await fetch(`/api/Tasks/${id}`, {
      method: 'PATCH',
    });

    window.location.reload();
  };

  const handleUpdate = async (
    id: string,
    title: string,
    description: string
  ) => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    await fetch('/api/Tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        title,
        description,
      }),
    });

    setEditingTaskId(null);
    window.location.reload();
  };

   return (
    <div>
      <h2>Mis tareas</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          {editingTaskId === task.id ? (
            <>
              <input
              id={`title-${task.id}`}
                type="text"
                defaultValue={task.title}
              />

              <textarea
                id={`description-${task.id}`}
                 defaultValue={task.description}
              />

              <button
                onClick={() => {
                  const title = (
                    document.getElementById(`title-${task.id}`) as HTMLInputElement
                  ).value;

                  const description = (
                    document.getElementById(`description-${task.id}`) as HTMLTextAreaElement
                  ).value;

                  handleUpdate(task.id, title, description);
                }}
              >
                Guardar
              
                            </button>

              <button onClick={() => setEditingTaskId(null)}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <button onClick={() => handleToggleComplete(task.id)}>
                {task.completed
                  ? 'Marcar como pendiente'
                  : 'Marcar como completada'}
              </button>

              <button onClick={() => setEditingTaskId(task.id)}>
                Editar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
