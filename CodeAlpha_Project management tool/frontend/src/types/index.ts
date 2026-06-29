// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'VIEWER';
  bio?: string;
  timezone?: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  slug: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  visibility: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  progress: number;
  startDate?: Date;
  endDate?: Date;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  boards: Board[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  role: 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'VIEWER';
  joinedAt: Date;
}

// Board types
export interface Board {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  order: number;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  order: number;
  color?: string;
  wipLimit?: number;
  tasks: Task[];
}

// Task types
export interface Task {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
  storyPoints?: number;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator: User;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  order: number;
  labels: TaskLabel[];
  comments: Comment[];
  attachments: Attachment[];
  dependencies: TaskDependency[];
  checklists: Checklist[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskLabel {
  id: string;
  taskId: string;
  labelId: string;
  label: Label;
}

export interface Label {
  id: string;
  projectId: string;
  name: string;
  color: string;
}

// Comment types
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  content: string;
  attachments: Attachment[];
  mentions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Attachment types
export interface Attachment {
  id: string;
  taskId?: string;
  commentId?: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
}

// Task dependency types
export interface TaskDependency {
  id: string;
  taskId: string;
  dependencyId: string;
  dependencyType: 'BLOCKS' | 'BLOCKED_BY' | 'RELATES_TO';
}

// Checklist types
export interface Checklist {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  order: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTaskId?: string;
  relatedProjectId?: string;
  relatedUserId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_COMPLETED'
  | 'MENTIONED_IN_COMMENT'
  | 'DUE_DATE_REMINDER'
  | 'PROJECT_INVITATION'
  | 'BOARD_CREATED'
  | 'FILE_UPLOADED'
  | 'COMMENT_ADDED'
  | 'TASK_UPDATED';

// Activity log types
export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  projectId?: string;
  boardId?: string;
  taskId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    skip: number;
    take: number;
    total: number;
  };
}

// Search types
export interface SearchResults {
  projects: Project[];
  tasks: Task[];
  boards: Board[];
  users: User[];
}
