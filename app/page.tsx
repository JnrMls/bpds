import { TaskModel } from '@/models/Task';
import TaskList from './TaskList';

export default function Home() {
  const tasks = TaskModel.getAll();

  return (
    <main>
      <h1>Lista de tareas</h1>
      <TaskList tasks={tasks} />
    </main>
  );
}