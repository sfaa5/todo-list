"use client";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import Column from "./Column";
import { useState } from "react";
import TaskCard from "./TaskCard";
import AddTaskForm from "./TaskForm";
import EditTaskDialog from "./EditTaskDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

export default function KanbanBoard({ tasks }: { tasks: any[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updates: { id: string; column?: string; order?: number }) =>
      apiClient.put(`/tasks/${updates.id}`, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const columns = ["backlog", "in_progress", "review", "done"];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    const isOverColumn = over.data?.current?.isColumn;


    // build columns arrays ordered by `order`
    const cols: Record<string, any[]> = {};
    for (const c of columns) {
      cols[c] = (tasks?.filter((t) => t.column === c) || [])
        .slice()
        .sort((a, b) => a.order - b.order);
    }


    let sourceCol = activeTask.column;
    let targetCol = sourceCol;
    let targetIndex = 0;

    if (isOverColumn) {
      targetCol = overId;
      // drop onto column background -> append to end
      targetIndex = cols[targetCol]?.length ?? 0;

    } else if (overTask) {
      targetCol = overTask.column;
      // try to get index from dnd data, fallback to findIndex
      targetIndex =
        over.data?.current?.sortable?.index ??
        cols[targetCol].findIndex((t) => t.id === overTask.id);
      if (targetIndex === -1) targetIndex = cols[targetCol].length;
    }

    // remove from source
    cols[sourceCol] = cols[sourceCol].filter((t) => t.id !== activeId);

    // adjust target index if source === target and original index was before target
    if (sourceCol === targetCol) {
      const originalIndex = (tasks?.filter((t) => t.column === sourceCol) || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .findIndex((t) => t.id === activeId);
      if (originalIndex !== -1 && originalIndex < targetIndex)
        targetIndex = Math.max(0, targetIndex - 1);
    }

    // insert into target
    const movingTask = { ...activeTask, column: targetCol };
    cols[targetCol].splice(targetIndex, 0, movingTask);

    // normalize orders and create updates list
    const updates: Array<{ id: string; column?: string; order?: number }> = [];

    for (const colName of Object.keys(cols)) {
      cols[colName].forEach((t, idx) => {
        if (t.id === activeId || t.order !== idx || t.column !== colName) {

          updates.push({ id: t.id, column: colName, order: idx });
          // also update local copy so subsequent checks compare correctly
          t.order = idx;
          t.column = colName;
        }
      });
    }

    // send updates (one request per changed task)
    updates.forEach((u) => mutation.mutate(u));
  };

  const [activeTask, setActiveTask] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [search, setSearch] = useState("");


  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const filteredTasks = search.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description || "").toLowerCase().includes(search.toLowerCase()),
      )
    : tasks;

  const totalCount = filteredTasks.length;

  return (
    <div className="">
      <div className="flex justify-between items-center px-5  pt-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold ">Task Dashboard</h1>
          <span className="text-gray-600 text-md">{totalCount} tasks</span>
        </div>

        <TextField
          size="small"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            ml: 2,

             '::placeholder': { color: 'blue' },
            backgroundColor: "#E6E6EB",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
      
            },
          }} // note the dot
        />
      </div>

      <Divider sx={{ my: 2 }} />

      <DndContext
        onDragStart={(e) =>
          setActiveTask(tasks.find((t) => t.id === e.active.id))
        }
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 2,
            p: 3,
            overflowX: "auto",
          }}
        >
          {columns.map((col) => {
            const tasksInCol = (
              filteredTasks?.filter((t) => t.column === col) || []
            ).sort((a, b) => a.order - b.order);
            return (
              <Column
                key={col}
                title={`${col}`}
                length={tasksInCol.length}
                tasks={tasksInCol}
                onTaskClick={(task) => setEditingTask(task)}
                onTaskDelete={(id) => deleteMutation.mutate(id)}
              >
                <Box sx={{ mt: 2 }}>
                  <AddTaskForm defaultColumn={col} />
                </Box>
              </Column>
            );
          })}
        </Box>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <EditTaskDialog
        task={editingTask}
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
