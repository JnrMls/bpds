import { TaskModel } from '@/models/Task';

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, title, description } = body;

    if (!id) {
      return Response.json(
        { error: 'Task id is required' },
        { status: 400 }
      );
    }

    const updatedTask = TaskModel.update(
      id,
      title,
      description
    );

     return Response.json(updatedTask);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Error updating task' },
      { status: 400 }
    );
  }
}