# Projex Frontend - Component Implementation Guide

This guide provides detailed instructions for implementing the remaining React components to complete the frontend application.

## 📋 Overview

The foundation is complete with:
- ✅ Project structure
- ✅ API client and hooks
- ✅ State management (Zustand stores)
- ✅ Type definitions
- ✅ Vite/Tailwind configuration
- ✅ Design system tokens

**What remains**: Implement React components that match the original prototype design.

## 🎯 Component Implementation Priority

### Phase 1: Authentication (2 components)
These are entry points - complete these first.

1. **LoginPage.tsx**
2. **RegisterPage.tsx**

### Phase 2: Layout (3 components)
Foundation for all other pages.

3. **MainLayout.tsx**
4. **Sidebar.tsx**
5. **Navbar.tsx**

### Phase 3: Dashboard (1 component)
Main landing page after login.

6. **DashboardPage.tsx**

### Phase 4: Projects (3 components)
Project listing and management.

7. **ProjectsPage.tsx**
8. **ProjectCard.tsx**
9. **CreateProjectModal.tsx**

### Phase 5: Boards & Tasks (7 components)
Core kanban functionality.

10. **BoardPage.tsx**
11. **KanbanBoard.tsx**
12. **Column.tsx**
13. **TaskCard.tsx**
14. **TaskModal.tsx**
15. **TaskDetailPanel.tsx**
16. **TaskForm.tsx**

### Phase 6: Supporting Pages (3 components)
Additional features.

17. **NotificationsPage.tsx**
18. **ProfilePage.tsx**
19. **NotificationDropdown.tsx**

### Phase 7: UI Components (10 components)
Reusable base components.

20-30. Button, Input, Modal, Card, Badge, Select, Textarea, Dropdown, etc.

## 📁 File Structure Reference

```
src/
├── pages/
│   ├── LoginPage.tsx              # Login form
│   ├── RegisterPage.tsx           # Registration form
│   ├── DashboardPage.tsx          # Main dashboard
│   ├── BoardPage.tsx              # Kanban board view
│   ├── ProjectsPage.tsx           # Projects list
│   ├── NotificationsPage.tsx      # Notifications list
│   └── ProfilePage.tsx            # User profile
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx         # Main app wrapper
│   │   ├── Sidebar.tsx            # Left sidebar navigation
│   │   └── Navbar.tsx             # Top navigation bar
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx        # Individual project card
│   │   ├── ProjectsList.tsx       # Projects grid/list
│   │   └── CreateProjectModal.tsx # New project modal
│   │
│   ├── boards/
│   │   ├── KanbanBoard.tsx        # Main kanban component
│   │   ├── Column.tsx             # Board column
│   │   └── TaskCard.tsx           # Task card in column
│   │
│   ├── tasks/
│   │   ├── TaskModal.tsx          # Task details modal
│   │   ├── TaskDetailPanel.tsx    # Side panel
│   │   ├── TaskForm.tsx           # Create/edit form
│   │   └── TaskComment.tsx        # Comment component
│   │
│   ├── notifications/
│   │   ├── NotificationDropdown.tsx
│   │   └── NotificationsList.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       ├── Dropdown.tsx
│       └── ...
│
├── hooks/
│   ├── useToast.ts               # Toast notifications
│   └── useKeyPress.ts            # Keyboard shortcuts
│
├── utils/
│   ├── cn.ts                     # Class name utility
│   └── formatDate.ts             # Date formatting
│
└── validations/
    ├── auth.ts                   # Login/register schemas
    ├── project.ts                # Project schemas
    └── task.ts                   # Task schemas
```

## 🎨 Design Reference

Use these design tokens from tailwind.config.js:

```javascript
// Colors
colors: {
  sidebar: '#0F1117',
  'bg-primary': '#F7F8FA',
  'card-bg': '#FFFFFF',
  'text-primary': '#1A1D23',
  'text-muted': '#6B7280',
  primary: '#5C6BC0',          // Accent
  'priority-low': '#9CA3AF',
  'priority-medium': '#3B82F6',
  'priority-high': '#F59E0B',
  'priority-urgent': '#EF4444',
  success: '#10B981',
  danger: '#EF4444',
}

// Spacing
width: { 'sidebar': '240px' }
height: { 'navbar': '60px' }
spacing: { 'sidebar': '240px' }

// Shadows
shadow: {
  'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
  'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
  'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
}
```

## 📝 Component Templates

### 1. LoginPage.tsx

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@api/hooks';
import { useAuthStore } from '@store/auth';
import { useAppStore } from '@store/app';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const { loginSuccess } = useAuthStore();
  const { addToast } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    login(
      { email, password },
      {
        onSuccess: (data) => {
          loginSuccess(data);
          addToast('Login successful', 'success');
          navigate('/dashboard');
        },
        onError: (error) => {
          addToast('Invalid email or password', 'error');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      {/* Login form JSX */}
    </div>
  );
}
```

### 2. DashboardPage.tsx

```typescript
import { useMe } from '@api/hooks';
import { useAppStore } from '@store/app';
import { MainLayout } from '@components/layout/MainLayout';

export default function DashboardPage() {
  const { data: user } = useMe();
  const { addToast } = useAppStore();

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Welcome, {user?.name}!
        </h1>
        
        {/* Dashboard content */}
      </div>
    </MainLayout>
  );
}
```

### 3. KanbanBoard.tsx

```typescript
import { useBoard } from '@api/hooks';
import { useMoveTask } from '@api/hooks';
import { useCallback } from 'react';

export default function KanbanBoard({ boardId }: { boardId: string }) {
  const { data: board } = useBoard(boardId);
  const { mutate: moveTask } = useMoveTask();

  const handleDragEnd = useCallback((result: any) => {
    const { draggableId, source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveTask({
      id: draggableId,
      fromColumnId: source.droppableId,
      toColumnId: destination.droppableId,
      order: destination.index,
    });
  }, [moveTask]);

  return (
    <div className="flex gap-6 p-6 bg-bg-primary overflow-x-auto">
      {board?.columns.map((column) => (
        <Column key={column.id} column={column} onDragEnd={handleDragEnd} />
      ))}
    </div>
  );
}
```

## 🔧 Implementation Steps

### Step 1: Create Basic Routing

Create `src/routes/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import BoardPage from '@pages/BoardPage';
// ... import other pages

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/board/:id', element: <BoardPage /> },
  // ... other routes
]);
```

### Step 2: Create App.tsx Entry Point

```typescript
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@store/auth';
import { router } from '@routes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate(); // Restore auth from cookies
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### Step 3: Create MainLayout Component

```typescript
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Navbar />
        <main className="flex-1 overflow-y-auto mt-[60px]">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Step 4: Implement Sidebar

```typescript
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@api/hooks';
import { useAppStore } from '@store/app';
import { useAuthStore } from '@store/auth';

export default function Sidebar() {
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { openModal } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-screen bg-sidebar text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-primary">Projex</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Navigation items */}
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-nav-hover p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
            {user?.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

### Step 5: Implement Kanban Column

```typescript
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Column as ColumnType } from '@types';

interface ColumnProps {
  column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-shrink-0 w-80 bg-white rounded-lg shadow-card p-4"
        >
          <h3 className="font-semibold text-text-primary mb-4">{column.name}</h3>

          <div className="space-y-3">
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
```

## 🎯 Key Implementation Notes

### State Management

Use Zustand stores:

```typescript
import { useAppStore } from '@store/app';
import { useAuthStore } from '@store/auth';

// In component
const { addToast, openModal } = useAppStore();
const { user } = useAuthStore();
```

### API Calls

Use React Query hooks:

```typescript
import { useProjects, useCreateTask } from '@api/hooks';

// In component
const { data: projects, isLoading } = useProjects();
const { mutate: createTask } = useCreateTask();
```

### Real-time Updates

Use Socket.IO:

```typescript
import { useEffect } from 'react';
import { io } from 'socket.io-client';

useEffect(() => {
  const socket = io(import.meta.env.VITE_SOCKET_URL);
  
  socket.on('task:updated', (task) => {
    // Handle task update
  });
  
  return () => socket.disconnect();
}, []);
```

### Form Validation

Use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🎨 Styling Conventions

### Class Names

Use Tailwind CSS with the custom tokens:

```tsx
// Colors
<div className="bg-sidebar text-white">           {/* Dark sidebar */}
<div className="bg-bg-primary text-text-primary"> {/* Main background */}
<div className="bg-primary">                      {/* Accent color */}

// Priority colors
<span className="bg-priority-high text-white">   {/* High priority */}
<span className="bg-priority-urgent text-white"> {/* Urgent */}

// Shadows
<div className="shadow-md">                       {/* Medium shadow */}
<div className="shadow-card">                     {/* Card shadow */}

// Spacing
<div className="p-4 gap-6 mt-8">                 {/* Padding, gap, margin */}
```

### Responsive Design

```tsx
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="hidden md:block">
```

## 📦 Dependencies Already Included

- react-beautiful-dnd (drag-and-drop)
- recharts (charts)
- lucide-react (icons)
- date-fns (date utilities)
- clsx & tailwind-merge (class utilities)

## 🚀 Testing Components

Create simple test files:

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## ✨ Tips for Implementation

1. **Start with UI components**: Button, Input, Modal before complex components
2. **Use TypeScript strictly**: Leverage type definitions for safety
3. **Keep components focused**: Single responsibility principle
4. **Use composition**: Build complex components from simple ones
5. **Memoize when needed**: Use React.memo for expensive components
6. **Handle loading states**: Show spinners/skeletons during data fetch
7. **Implement error boundaries**: Catch and display errors gracefully
8. **Add keyboard shortcuts**: Tab navigation, Escape to close modals
9. **Consider accessibility**: ARIA labels, semantic HTML
10. **Test thoroughly**: Unit and integration tests for critical features

## 📚 Reference Files in Project

- `src/types/index.ts` - All TypeScript types
- `src/api/hooks.ts` - All API hooks
- `src/store/auth.ts` - Auth state
- `src/store/app.ts` - App state
- `tailwind.config.js` - Design tokens
- `vite.config.ts` - Build configuration

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [React Query Docs](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ✅ Completion Checklist

- [ ] Create all pages (7)
- [ ] Create layout components (3)
- [ ] Create project components (3)
- [ ] Create board/task components (7)
- [ ] Create notification components (2)
- [ ] Create UI components (10+)
- [ ] Create custom hooks (2+)
- [ ] Create utility functions
- [ ] Create validation schemas
- [ ] Test authentication flow
- [ ] Test project management
- [ ] Test kanban functionality
- [ ] Test notifications
- [ ] Test responsiveness
- [ ] Test error handling
- [ ] Deploy to production

**Estimated Time**: 20-30 hours for an experienced React developer

---

Good luck with implementation! The backend is fully functional and ready to power your frontend. 🚀
