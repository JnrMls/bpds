import { NextResponse } from "next/server";
import { TaskModel } from "@/models/Task";

export async function GET() {
   try{
    const tasks = TaskModel.getAll();

    return NextResponse.json(tasks);
   } catch (error) {
    return NextResponse.json(
        { error: "Failedto retrive tasks" },
        { status: 500 }
    );
    }
}