"use client";

import { useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [tasks,setTasks] =useState<Task[]>([]);
  const [newTask,setNewTask]= useState("");

  const addTask = () => {
    if (newTask.trim() ==="") {
      return;
    }

    const task: Task = {
    id: Date.now(),
    text: newTask,
    completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  return (
    <main>
      <h1>Task List</h1>

      <input
      type="text"
      value={newTask}
      onChange={ (e) => setNewTask(e.target.value)}
      placeholder="Add a task"
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}
          </li>
        ))}
      </ul>
    </main>    
  );
}
