"use client";

import { useState } from "react";
import { editTask } from "../app/actions";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Task } from "@/lib/models/Task";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface UpdateTaskProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

export default function UpdateTask({ task, onTaskUpdated }: UpdateTaskProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState<Date | null>(new Date(task.dueDate || Date.now()));
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      toast.error("Please fill out all fields");
      return;
    }

    // Validate task._id
    if (!task._id || typeof task._id !== "string" || !/^[0-9a-fA-F]{24}$/.test(task._id)) {
      toast.error("Invalid Task ID");
      return;
    }

    try {
      const updatedTask = {
        title,
        description,
        dueDate: dueDate.toISOString(),
      };

      console.log("Task ID:", task._id); 
      console.log("Updated Task Data:", updatedTask); 

      setLoading(true); 
      await editTask(task._id, updatedTask); 
      setIsOpen(false);
      toast.success("Task updated successfully");
      onTaskUpdated({ ...task, ...updatedTask });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg bg-red-600 hover:bg-green-400 text-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-red-900 text-white">
        <DialogHeader>
          <DialogTitle className="font-medium">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="bg-gray-700 border-green-700 text-white"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            required
            className="bg-gray-700 border-green-700 text-white"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select due date"
            className="w-full p-2 border rounded-md bg-gray-700 border-green-700 text-white cursor-pointer"
            required
          />
          <Button
            type="submit"
            variant="outline"
            className="w-full bg-blue-500 hover:bg-red-600 text-white"
            disabled={loading} 
          >
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}