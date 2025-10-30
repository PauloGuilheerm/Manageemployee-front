import { Navbar } from '../components/ui/Navbar'
import { Sidebar } from '../components/ui/Sidebar'
import { EmployeeForm, type EmployeeFormValues } from '../components/EmployeeForm'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { useNavigate } from 'react-router-dom'

export default function EmployeeFormPage() {
  const { create } = useEmployeeStore()
  const navigate = useNavigate()

  async function handleSubmit(values: EmployeeFormValues) {
    const res = await create(values as any)
    if (res) navigate('/employees')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-4">
          <h1 className="text-xl font-semibold">Novo Employee</h1>
          <div className="rounded-xl border p-6 bg-white">
            <EmployeeForm onSubmit={handleSubmit} submitLabel="Criar" isCreate />
          </div>
        </main>
      </div>
    </div>
  )
}


