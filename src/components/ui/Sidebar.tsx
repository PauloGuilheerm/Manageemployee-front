import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export function Sidebar() {
    const { user } = useAuth()

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`

    return (
        <aside className="h-[calc(100vh-3.5rem)] w-64 border-r p-4">
            <div className="mb-6">
                <div className="font-semibold">{user?.email?.split('@')[0] || 'Usuário'}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
            </div>

            <nav className="space-y-1">
                <NavLink to="/employees" className={linkClass}>Employees</NavLink>
                <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            </nav>
        </aside>
    )
}


