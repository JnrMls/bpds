import { describe, it, expect } from 'vitest';
import { TaskModel } from '../models/Task';

describe('Actualización de tareas', () => {
  it('debe actualizar el título y la descripción de una tarea', () => {
    const task = TaskModel.create('Tarea de prueba', 'Descripción original');

    const updatedTask = TaskModel.update(
      task.id,
      'Tarea actualizada',
      'Descripción actualizada',
      false
    );

    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.title).toBe('Tarea actualizada');
    expect(updatedTask?.description).toBe('Descripción actualizada');
  });
});