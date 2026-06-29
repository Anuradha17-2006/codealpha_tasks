import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-main-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-sidebar overflow-hidden">
        {/* Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-main-bg">
          {children}
        </main>
      </div>
    </div>
  )
}
