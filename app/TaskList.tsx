'use client';

import { useState } from 'react';
import { Task } from '@/models/Task';

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
  return (
    <div>
      <h2>Mis tareas</h2>

       {tasks.map((task) => (
        <div key={task.id}>
  <h3>{task.title}</h3>
  <p>{task.description}</p>

  <button onClick={() => handleToggleComplete(task.id)}>
  {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
</button>

<button onClick={() => setEditingTaskId(task.id)}>
  Editar
</button>

{editingTaskId === task.id && (
  <div>
  <input
    type="text"
    defaultValue={task.title}
  />

  <textarea
    defaultValue={task.description}
  />
</div>
)}
</div>
      ))}
    </div>
  );
}