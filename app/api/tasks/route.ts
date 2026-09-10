import { NextResponse } from "next/server";
import {TaskModel} from "@/models/Task";

//Obtiene todas las respuestas registradas
export async function GET() {
  try{
    const tasks =TaskModel.getAll();
    return NextResponse.json(tasks, { status: 200});
  } catch (error) {
    return NextResponse.json(
      {error: "Error al obtener las tareas"}, { status: 500}
    );
  }
}

//Crea una nueva tarea cuando el usuario presiona ENTER
export async function POST(request:Request) {
  try {
    const body = await request.json();
    const { title} = body;
    
    if(!title) {
      return NextResponse.json({error: "El título es obligatorio"}, { status: 400});
    };
    const newTask = TaskModel.create(title,"");
    return NextResponse.json(newTask, {status: 201});
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno"}, { status: 500 });
  }
}  

//Elimina una tarea
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "El id es obligatorio" },
        { status: 400 }
      );
    }

    const deleted = TaskModel.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Tarea eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la tarea" },
      { status: 500 }
    );
  }
}
