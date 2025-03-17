"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "../lib/mongodb";
import type { Task, ServerTask } from "../lib/models/Task";
import { ObjectId } from "mongodb";

// Error messages (Useful)
const ERROR_MESSAGES = {
  DATABASE_CONNECTION: "Failed to connect to the DB",
  FETCH_TASKS: "Failed to fetch tasks.",
  CREATE_TASK: "Failed to create task.Check DB",
  UPDATE_TASK: "Failed to update task.",
  EDIT_TASK: "Failed to edit task",
  DELETE_TASK: "Failed to delete task",
  INVALID_TASK_ID: "Invalid Task ID",
  TASK_NOT_FOUND: "Task not found or no changes made",
  ALL_FIELDS_REQUIRED: "All fields are required.",
};

// MongoDB connection
async function connectToDatabase() {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(ERROR_MESSAGES.DATABASE_CONNECTION);
  }
}

// Fetch all tasks
export async function getTasks(): Promise<Task[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<ServerTask>("tasks");
    const serverTasks = await collection.find({}).sort({ dueDate: 1 }).toArray();

    return serverTasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      dueDate: new Date(task.dueDate).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw new Error(`${ERROR_MESSAGES.FETCH_TASKS}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Create a new task
export async function createTask(task: Omit<Task, "_id">) {
  console.log("Creating task with data:", task); 
  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Validate input
    if (!task.title || !task.description || !task.dueDate) {
      throw new Error(ERROR_MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // Insert new task
    const result = await collection.insertOne({
      ...task,
      dueDate: new Date(task.dueDate),
    });

    revalidatePath("/");
    return { success: true, message: "Task created successfully", id: result.insertedId.toString() };
  } catch (error) {
    console.error("Failed to create task. DB Error:", error);
    throw new Error(`${ERROR_MESSAGES.CREATE_TASK}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Update task status
export async function updateTask(id: string, updates: Omit<Task, "dueDate" | "_id" | "title" | "description">) {
  console.log("Updating task with ID:", id, "and updates:", updates);
  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error(ERROR_MESSAGES.INVALID_TASK_ID);
    }

    // Update task
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates },
    );

    revalidatePath("/");
    return { success: true, message: "Task updated successfully" };
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error(`${ERROR_MESSAGES.UPDATE_TASK}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Edit task details
export async function editTask(id: string, updatedFields: Partial<Omit<Task, "_id">>) {
  console.log("Editing task with ID:", id, "and updated fields:", updatedFields); 

  try {
    // Validate input
    if (!updatedFields.title || !updatedFields.description || !updatedFields.dueDate) {
      throw new Error(ERROR_MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid Task ID:", id);
      throw new Error(ERROR_MESSAGES.INVALID_TASK_ID);
    }

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Update task
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 0) {
      throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    revalidatePath("/");
    return { success: true, message: "Task updated successfully" };
  } catch (error) {
    console.error("Failed to edit task:", error);
    throw new Error(`${ERROR_MESSAGES.EDIT_TASK}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
// Delete a task
export async function deleteTask(id: string) {
  console.log("Deleting task with ID:", id); 
  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error(ERROR_MESSAGES.INVALID_TASK_ID);
    }

    // Delete task
    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/");
    return { success: true, message: "Task deleted successfully" };
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error(`${ERROR_MESSAGES.DELETE_TASK}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
