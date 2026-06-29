import { useState } from 'react'
import { useMe, useProjects, useCreateProject } from '@api/hooks'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import { FolderOpen, CheckCircle, Clock, Users, Plus, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const { data: user } = useMe()
  const { data: projects = [] } = useProjects()
  const { mutate: createProject, isPending } = useCreateProject()
  const navigate = useNavigate()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert('Project name is required')
      return
    }

    createProject(
      {
        name: projectName,
        description: projectDesc,
        visibility: 'PRIVATE',
        status: 'PLANNING',
      },
      {
        onSuccess: (newProject) => {
          setShowCreateModal(false)
          setProjectName('')
          setProjectDesc('')
          navigate(`/projects/${newProject.id}/board`)
        },
        onError: (error: any) => {
          alert('Failed to create project: ' + (error.message || 'Unknown error'))
        },
      }
    )
  }

  // Stats data
  const stats = [
    {
      label: 'Total Tasks',
      value: 42,
      icon: FolderOpen,
      color: 'text-blue-500',
    },
    {
      label: 'My Tasks',
      value: 15,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Completed',
      value: 28,
      icon: Clock,
      color: 'text-orange-500',
    },
    {
      label: 'In Progress',
      value: 14,
      icon: Users,
      color: 'text-purple-500',
    },
  ]

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-muted font-medium mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-main-bg rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">Projects</h2>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
            >
              <Plus size={18} />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project: any) => (
              <Card
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/board`)}
                className="cursor-pointer hover:shadow-md"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
                    <p className="text-sm text-text-muted mt-1">{project.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-muted">Progress</span>
                      <span className="text-xs font-semibold text-text-primary">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.members?.slice(0, 3).map((member: any, i: number) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-white"
                        >
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">{project.members?.length || 0} members</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* My Tasks Section */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">My Tasks</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Task</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Project</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b border-border hover:bg-main-bg transition-colors">
                      <td className="py-3 px-4 text-text-primary">Fix login issue</td>
                      <td className="py-3 px-4 text-text-muted">Website</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                          High
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted">Jun 30, 2026</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
          <Card>
            <div className="space-y-4">
              {[
                { action: 'You created project', project: 'Website Redesign', time: '2 hours ago' },
                { action: 'Task completed', project: 'Design System', time: '1 day ago' },
                { action: 'Comment added', project: 'Mobile App', time: '3 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-text-primary">{activity.action} <strong>{activity.project}</strong></p>
                    <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={isPending}
          />

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
            <textarea
              placeholder="Project description (optional)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 disabled:bg-main-bg text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              loading={isPending}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
