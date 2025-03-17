"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/models/Task";
import { updateTask, deleteTask } from "../app/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import TaskForm from "./TaskForm";
import UpdateTask from "./UpdateTask";

// Static fallback tasks
const fallbackTasks: Task[] = [
  {
    _id: "1",
    title: "Assignment",
    description: "Project Should be deployed on vercel for free hosting",
    dueDate: "2025-02-25T00:00:00.000Z",
    completed: false,
  },
  {
    _id: "2",
    title: "NailIB Technical Interview",
    description: "Date Published.",
    dueDate: "2025-03-18T00:00:00.000+00:00",
    completed: false,
  },
  {
    _id: "3",
    title: "Scalezix Technical Round",
    description: "Backend Integration",
    dueDate: "2025-02-25T00:00:00.000+00:00",
    completed: false,
  }
];

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const router = useRouter();

  
  console.log("Initial Tasks (from props):", initialTasks);
  console.log("Current Tasks (state):", tasks);

  useEffect(() => {
    // If initialTasks is empty, use fallback tasks
    if (initialTasks.length === 0) {
      setTasks(fallbackTasks);
    } else {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const handleComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed });
      router.refresh();
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      router.refresh();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete task");
    }
  };

  const addTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  return (
    <div className="space-y-8 p-4">
      <div className="static top-24 left-6 right-6 z-50 bg-custom-teal">
        <TaskForm onTaskAdded={addTask} />
      </div>
      {/* Task List */}
      <div className="pt-20"> 
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task._id?.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:bg-gray-800 transition-colors duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => handleComplete(task._id!.toString(), checked as boolean)}
                        className="border-red-700"
                      />
                      <div>
                        <h3
                          className={`font-semibold text-lg ${task.completed ? "line-through text-blue-700" : "text-white"}`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-yellow-300 mt-2 max-h-28 overflow-y-auto">{task.description}</p>
                        <p className="text-sm text-green-500 mt-2">Due Date: {new Date(task.dueDate).toISOString().split("T")[0]}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(task._id!.toString())}
                        className="rounded-lg bg-red-600 hover:bg-green-400 text-white"
                      >
                        Delete
                      </Button>
                      <UpdateTask task={task} onTaskUpdated={editTask} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}