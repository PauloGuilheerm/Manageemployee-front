import { useEffect, useState } from 'react'
import { Navbar } from '../components/ui/Navbar'
import { Sidebar } from '../components/ui/Sidebar'
import { endpoints } from '../api/endpoints'
import type { Employee } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { ROLES } from '../utils/enums'

export default function Profile() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.email) return
    endpoints.employees.getByEmail(user.email).then(({ data }) => {
      setEmployee(data)
    }).finally(() => setLoading(false))
  }, [user?.email])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-4">
          <h1 className="text-xl font-semibold">Profile</h1>
          {loading ? (
            <div>Carregando...</div>
          ) : employee ? (
            <div className="rounded-xl border p-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Nome:</span> {employee.firstName} {employee.lastName}</div>
                <div><span className="text-gray-600">Email:</span> {employee.email}</div>
                <div><span className="text-gray-600">Doc:</span> {employee.docNumber}</div>
                <div><span className="text-gray-600">Role:</span> {Object.keys(ROLES).find(key => ROLES[key as keyof typeof ROLES] === employee.role)}</div>
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


