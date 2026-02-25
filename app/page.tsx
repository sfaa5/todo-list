"use client"
import KanbanBoard from "@/components/Kanban/KanbanBoard";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {


  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tasks');
      return data;
    },
  });

  if (isLoading)
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <div>Error loading data!</div>;


  
  return (
<main className="min-h-screen pb-8 bg-[#F5F5F5]">

      {/* هنا بنمرر الـ tasks اللي جبناها للـ Component */}
      <KanbanBoard tasks={tasks} />
    </main>
  );
}
