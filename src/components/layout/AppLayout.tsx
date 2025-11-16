import { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface SidebarProps {
  isRunning: boolean
  chaosLevel: number
  tickCount: number
  onToggleRunning: () => void
  onStep: () => void
  onReset: () => void
}

interface AppLayoutProps {
  children: ReactNode
  sidebarProps?: SidebarProps
}

export default function AppLayout({ children, sidebarProps }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

