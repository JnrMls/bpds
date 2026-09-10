import { NextResponse } from 'next/server';
import { TaskModel } from '@/models/Task';
import path from 'path'
import fs from 'fs'

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

// Actualiza una tarea existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'El ID de la tarea es obligatorio' },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    const updatedTask = TaskModel.update(
      id,
      title.trim(),
      description ?? '',
      Boolean(completed)
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'tasks.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'No hay datos' }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    let tasks = JSON.parse(fileData);

    const filteredTasks = tasks.filter((task: any) => task.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(filteredTasks, null, 2));

    return NextResponse.json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar la tarea' }, { status: 500 });
  }
}