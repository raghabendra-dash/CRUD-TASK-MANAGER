// "use client"; 
import { Github, Linkedin } from "lucide-react";
import TaskList from "../components/TaskList";
import { getTasks } from "./actions";
import type { Task } from "@/lib/models/Task";
import Link from "next/link";

export default async function Home() {
  let tasks: Task[] = [];

  try {
    tasks = await getTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // If the database connection fails, pass an empty array to TaskList
    tasks = [];
  }

  return (
    <main className="min-h-screen text-white flex flex-col justify-between bg-custom-teal">
      <div className="mb-4 border-b w-full p-4 px-4 mx-auto flex justify-between items-center align-middle">
        <h1 className="text-3xl text-center">Task Manager</h1>
        <Link href="https://github.com/raghabendra-dash/CRUD-Task-Manager.git" target="_blank">
          <Github className="h-6 w-6 hover:text-yellow-400 transition-colors" />
        </Link>
      </div>
      <TaskList initialTasks={tasks} />
      <div className="text-xl border-t p-4 px-8 flex justify-center items-center gap-4">
        Made by{":- "}
        <Link
          href="https://www.linkedin.com/in/raghabendra779"
          target="_blank"
          className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
        >
          <Linkedin className="h-5 w-5" /> Raghabendra Dash
        </Link>
        <span>|</span>
        <Link
          href="https://github.com/raghabendra-dash"
          target="_blank"
          className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
        >
          <Github className="h-5 w-5" /> GitHub
        </Link>
      </div>
    </main>
  );
}
