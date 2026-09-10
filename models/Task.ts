import fs from 'fs';
import path from 'path';
//Importé fs (File System) para leer y escribir archivos en el sistema de archivos, y path para manejar rutas de archivos y directorios.



//LA INTERFACE TASK
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
// Definí una interfaz Task que describe la estructura de un objeto de tarea con sus propiedades.


//DIRECTORIO DE DATOS
const dbPath = path.join(process.cwd(), 'data', 'tasks.json');
// Definí la ruta del archivo tasks.json donde se almacenarán las tareas. dbPath guarda la dirección exacta de nuestro archivero.



//FUNCIONES PARA LAS TAREAS

// Función para leer todas las tareas (usando la sintaxis limpia)
export const TaskModel = {
  getAll(): Task[] {
    if (!fs.existsSync(dbPath)) return []; 
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  },

// Función para CREAR una tarea
create(title: string, description: string): Task {
    const tasks = TaskModel.getAll();
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: title,
      description: description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2));
    return newTask;
  },

  // Función para ACTUALIZAR una tarea
  update(id: string, title: string, description: string, completed: boolean): Task | null {
    const tasks = TaskModel.getAll();

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return null;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title,
      description,
      completed
    };

    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2));

    return tasks[taskIndex];
  }
};
;
