import { useProjects, useCreateProject } from '@api/hooks'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
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

  return (
    <MainLayout title="Projects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">All Projects</h2>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-text-muted mb-4">No projects yet</p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
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

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">{project.members?.length || 0} members</span>
                    <span className="text-text-muted capitalize">{project.status}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

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
