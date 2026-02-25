"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

type AddTaskFormProps = {
  defaultColumn?: string;
};

export default function AddTaskForm({ defaultColumn }: AddTaskFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (newTask: any) => apiClient.post('/tasks', newTask),
    onSuccess: () => {
      // invalidate and close dialog on success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    mutation.mutate({
      title: formData.get('title'),
      description: formData.get('description'),
      column: defaultColumn || formData.get('column') || 'backlog',
    });
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Task
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Task</DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
        >
          <TextField label="Title" name="title" required fullWidth />
          <TextField
            label="Description"
            name="description"
            required
            fullWidth
            multiline
            minRows={3}
          />

          {defaultColumn && (
            <input type="hidden" name="column" value={defaultColumn} />
          )}
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}