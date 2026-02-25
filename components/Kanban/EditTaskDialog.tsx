"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export default function EditTaskDialog({
  task,
  open,
  onClose,
}: {
  task: any;
  open: boolean;
  onClose: () => void;
}) {
  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') return; // ignore stray clicks
    onClose();
  };
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: (updates: any) => apiClient.put(`/tasks/${task.id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const handleSave = () => {
    if (!task) return;
    mutation.mutate({ title, description });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
