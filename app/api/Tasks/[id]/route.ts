import { TaskModel } from '@/models/Task';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updatedTask = TaskModel.toggleComplete(id);

    return Response.json(updatedTask);
  } catch (error) {
    return Response.json(

        { error: error instanceof Error ? error.message : 'Error updating task status' },
      { status: 400 }
    );
  }
}