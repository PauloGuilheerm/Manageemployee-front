import { useEffect, useState } from 'react'
import { Navbar } from '../components/ui/Navbar'
import { Sidebar } from '../components/ui/Sidebar'
import { endpoints } from '../api/endpoints'
import type { Employee } from '../api/types'

export default function Profile() {
    const [me, setMe] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        endpoints.employees.me().then(({ data }) => {
            if (mounted) setMe(data)
        }).finally(() => setLoading(false))
        return () => { mounted = false }
    }, [])

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 space-y-4">
                    <h1 className="text-xl font-semibold">Profile</h1>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : me ? (
                        <div className="rounded-xl border p-4">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-600">Nome:</span> {me.firstName} {me.lastName}</div>
                                <div><span className="text-gray-600">Email:</span> {me.email}</div>
                                <div><span className="text-gray-600">Doc:</span> {me.docNumber}</div>
                                <div><span className="text-gray-600">Role:</span> {me.role}</div>
                            </div>
                        </div>
                    ) : (
                        <div>Não encontrado.</div>
                    )}
                </main>
            </div>
        </div>
    )
}


