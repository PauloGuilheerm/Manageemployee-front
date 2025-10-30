import { useAuth } from '../../auth/useAuth'
import { LogOut } from 'lucide-react'

export function Navbar() {
    const { user, logout } = useAuth()
    return (
        <header className="w-full h-14 border-b bg-white/60 backdrop-blur flex items-center justify-between px-4">
            <div className="font-semibold">Employee Manager</div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                    <LogOut className="size-4" />
                    Logout
                </button>
            </div>
        </header>
    )
}


