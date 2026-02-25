"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type ColumnProps = {
  title: string;
  tasks: any[];
  onTaskClick?: (task: any) => void;
  onTaskDelete?: (id: string) => void;
  children?: React.ReactNode;
  length?: number;
};

export default function Column({
  length,
  title,
  tasks,
  onTaskClick,
  onTaskDelete,
  children,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title,
    data: { isColumn: true },
  });

  return (
    <Paper
      ref={setNodeRef}
      elevation={3}
      sx={{
        width: "100%",
        p: 2,
        bgcolor: "#EBF0F0",
        minHeight: 500,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow:"none"
      }}
    >
      <div className="flex flex-row items-center gap-2">
        {/* color dot varies by column */}
        <div
          className={
            `w-2 h-2 rounded-full mb-1 ` +
            ( {
                backlog: 'bg-blue-500',
                in_progress: 'bg-yellow-500',
                review: 'bg-purple-500',
                done: 'bg-green-500',
              }[title] || 'bg-gray-500')
          }
        />
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            textTransform: "uppercase",
            fontWeight: 700, // change weight
            color: "#50596C", // theme colour
            fontSize: 14, // override size
          }}
        >
          {title}
        </Typography>

        <span className="text-gray-500 text-[11px]   rounded-full border-0 mb-1 w-6 bg-[#E6E6EB] text-center">
          {length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onDelete={onTaskDelete}
          />
        ))}
      </SortableContext>

      {children}
    </Paper>
  );
}
