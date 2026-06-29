import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { AuthResponse, Project, Task, Board, Notification, User } from '@types';

// ========== AUTH HOOKS ==========

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: {
      email: string;
      name: string;
      password: string;
      confirmPassword: string;
    }) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
      return data;
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    },
  });
};

// ========== PROJECT HOOKS ==========

export const useProjects = (params?: { skip?: number; take?: number; status?: string }) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/projects', { params });
      return data.data as Project[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${id}`);
      return data as Project;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: { name: string; description?: string }) => {
      const { data } = await apiClient.post('/projects', project);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data } = await apiClient.put(`/projects/${id}`, updates);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// ========== BOARD HOOKS ==========

export const useProjectBoards = (projectId: string) => {
  return useQuery({
    queryKey: ['boards', projectId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${projectId}/boards`);
      return data as Board[];
    },
    enabled: !!projectId,
  });
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/boards/${id}`);
      return data as Board;
    },
    enabled: !!id,
  });
};

// ========== TASK HOOKS ==========

export const useTasks = (params?: { boardId?: string; columnId?: string; status?: string }) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/tasks', { params });
      return data.data as Task[];
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${id}`);
      return data as Task;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: { columnId: string; title: string; [key: string]: any }) => {
      const { data } = await apiClient.post('/tasks', task);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data } = await apiClient.put(`/tasks/${id}`, updates);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      fromColumnId,
      toColumnId,
      order,
    }: {
      id: string;
      fromColumnId: string;
      toColumnId: string;
      order: number;
    }) => {
      const { data } = await apiClient.patch(`/tasks/${id}/move`, {
        fromColumnId,
        toColumnId,
        order,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// ========== NOTIFICATION HOOKS ==========

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications');
      return data.data as Notification[];
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/count/unread');
      return data.unreadCount as number;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

// ========== USER HOOKS ==========

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${id}`);
      return data as User;
    },
    enabled: !!id,
  });
};

// ========== SEARCH HOOKS ==========

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await apiClient.get('/search', { params: { q: query } });
      return data;
    },
    enabled: query.length > 0,
  });
};

// ========== PROFILE HOOKS ==========

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; bio: string; timezone: string }) => {
      const { data: result } = await apiClient.put('/auth/profile', data);
      return result.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const { data: result } = await apiClient.post('/auth/change-password', data);
      return result.data;
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const { data: result } = await apiClient.delete('/auth/account');
      return result.data;
    },
  });
};
