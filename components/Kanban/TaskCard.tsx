"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

type TaskCardProps = {
  task: any;
  onClick?: (task: any) => void;
  onDelete?: (id: string) => void;
};

export default function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handlePointerUp = () => {
    if (!isDragging) {
      onClick?.(task);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} sx={{ mb: 1 ,border: "0.1px solid #e0e0e0", borderRadius:2 , boxShadow:"none"}} >
      <CardContent
        {...attributes}
        {...listeners}
        sx={{ cursor: "grab", pb: 1 ,p:2}}
      >
        <Typography variant="subtitle2" sx={{fontWeight:"600"}}>{task.title}</Typography>
        <Typography variant="body2" color="text.secondary" >
          {task.description}
        </Typography>
      </CardContent>

      <div className="flex justify-end items-center gap-1 px-1" >
        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1, pb: 1 }}>
          <IconButton sx={{ p: 0.5 }} onClick={() => onClick?.(task)}>
            <EditIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1, pb: 1 }}>
          <IconButton
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
          >
            <CloseIcon sx={{ fontSize: 14, transform: "scale(1.2)" }} />
          </IconButton>
        </Box>
      </div>
    </Card>
  );
}
