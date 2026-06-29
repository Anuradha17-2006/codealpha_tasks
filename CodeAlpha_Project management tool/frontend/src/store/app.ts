import { create } from 'zustand';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;

  // Current project
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  // Current board
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;

  // Toast
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>;
  addToast: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    duration?: number
  ) => void;
  removeToast: (id: string) => void;

  // Modals
  modals: {
    createProject: boolean;
    createTask: boolean;
    editTask: boolean;
    taskDetail: boolean;
  };
  openModal: (modal: keyof AppState['modals']) => void;
  closeModal: (modal: keyof AppState['modals']) => void;
}

let toastId = 0;

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  // Notifications
  notificationCount: 0,
  setNotificationCount: (count) => set({ notificationCount: count }),

  // Project
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),

  // Board
  activeBoardId: null,
  setActiveBoardId: (id) => set({ activeBoardId: id }),

  // Toasts
  toasts: [],
  addToast: (message, type = 'info', duration = 4000) => {
    const id = `toast-${toastId++}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Modals
  modals: {
    createProject: false,
    createTask: false,
    editTask: false,
    taskDetail: false,
  },
  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    })),
}));
