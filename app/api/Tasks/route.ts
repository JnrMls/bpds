import { NextResponse } from 'next/server';
import { TaskModel } from '@/models/Task';

// Obtiene todas las tareas registradas
export async function GET() {
  try {
    const tasks = TaskModel.getAll();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las tareas' }, { status: 500 });
  }
}

// Crea una nueva tarea cuando el usuario presiona Enter
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 });
    }

    const newTask = TaskModel.create(title, '');
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
