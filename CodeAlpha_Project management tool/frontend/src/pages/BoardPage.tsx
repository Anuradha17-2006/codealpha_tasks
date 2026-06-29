import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProject, useCreateTask, useTasks } from '@api/hooks'
import MainLayout from '@components/layout/MainLayout'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import { Plus, Zap, AlertCircle } from 'lucide-react'

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Done']

export default function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId || '')
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  const { mutate: createTask, isPending: isCreating } = useCreateTask()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('Todo')

  if (projectLoading) {
    return (
      <MainLayout title="Board">
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-text-muted">Loading board...</div>
        </div>
      </MainLayout>
    )
  }

  if (projectError || !project) {
    return (
      <MainLayout title="Board">
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-text-muted">Board not found</div>
        </div>
      </MainLayout>
    )
  }

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      alert('Task title is required')
      return
    }

    createTask(
      {
        title: taskTitle,
        description: taskDesc,
        status: selectedColumn,
        projectId: projectId || '',
        priority: 'MEDIUM',
      },
      {
        onSuccess: () => {
          setShowCreateModal(false)
          setTaskTitle('')
          setTaskDesc('')
          setSelectedColumn('Todo')
        },
        onError: (error: any) => {
          alert('Failed to create task: ' + (error.message || 'Unknown error'))
        },
      }
    )
  }

  const groupedTasks = COLUMNS.reduce((acc, status) => {
    acc[status] = tasks.filter(
      (task: any) => task.status === status && task.projectId === projectId
    )
    return acc
  }, {} as Record<string, any[]>)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-orange-100 text-orange-700'
      case 'Medium':
        return 'bg-blue-100 text-blue-700'
      case 'Low':
        return 'bg-gray-100 text-gray-700'
      case 'Urgent':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <MainLayout title={project.name}>
      <div className="space-y-6">
        {/* Board Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
            <p className="text-text-muted mt-1">{project.description}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus size={18} />
            Add Task
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((column) => (
              <div
                key={column}
                className="flex-shrink-0 w-80 space-y-3"
              >
                {/* Column Header */}
                <div className="bg-main-bg rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-text-primary text-sm">{column}</h2>
                    <span className="text-xs text-text-muted bg-white px-2 py-1 rounded font-medium">
                      {groupedTasks[column]?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3">
                  {groupedTasks[column] && groupedTasks[column].length > 0 ? (
                    groupedTasks[column].map((task: any) => (
                      <Card
                        key={task.id}
                        className="cursor-grab active:cursor-grabbing bg-white border border-border hover:shadow-md"
                      >
                        <div className="space-y-2">
                          <h3 className="font-semibold text-text-primary text-sm">{task.title}</h3>
                          
                          {task.description && (
                            <p className="text-xs text-text-muted">{task.description}</p>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(task.priority || 'Low')}`}>
                              {task.priority || 'Low'}
                            </span>

                            {task.assignee && (
                              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center ml-auto">
                                {task.assignee.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-xs text-text-muted">No tasks yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            disabled={isCreating}
          />

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
            <textarea
              placeholder="Task description (optional)"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              disabled={isCreating}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 disabled:bg-main-bg text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Status</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              disabled={isCreating}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 disabled:bg-main-bg text-sm bg-white"
            >
              {COLUMNS.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTask}
              loading={isCreating}
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
