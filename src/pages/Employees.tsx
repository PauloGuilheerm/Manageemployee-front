import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../components/ui/Navbar'
import { Sidebar } from '../components/ui/Sidebar'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { EmployeeTable } from '../components/EmployeeTable'
import { EmployeeForm, type EmployeeFormValues } from '../components/EmployeeForm'
import { useAuth } from '../auth/useAuth'
import { can } from '../utils/roles'
import * as Dialog from '@radix-ui/react-dialog'
import { endpoints } from '../api/endpoints'
import { ROLES } from '../utils/enums'

export default function Employees() {
  const { items, fetch, create, update, remove, shouldUpdate, clearUpdate } = useEmployeeStore()
  const { user } = useAuth()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    if (shouldUpdate) {
      fetch().finally(() => clearUpdate())
    }
  }, [shouldUpdate, fetch, clearUpdate])

  const editingItem = useMemo(() => items.find(i => i.id === editingId), [items, editingId])

  async function handleCreate(values: EmployeeFormValues) {
    await create(values as any)
    setOpen(false)
  }

  async function handleUpdate(values: EmployeeFormValues) {
    if (!editingId) return
    const userId = await endpoints.employees.getByEmail(user?.email ?? '').then(({ data }) => {
      return data.id
    });
    await update(editingId, { ...values, isOwner: userId === editingId, newRole: values.role } as any)
    setOpen(false)
    setEditingId(null)
  }

  const currentRole = useMemo(()=> {
    switch(user?.role) {
      case 'Director':
        return ROLES.DIRECTOR
      case 'Leader':
        return ROLES.LEADER
      default:
        return ROLES.EMPLOYEE
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Employees</h1>
            {can.create((currentRole)) && (
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <button className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm">Novo</button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/20" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow">
                    <Dialog.Title className="text-lg font-semibold">Novo Employee</Dialog.Title>
                    <div className="mt-4">
                      <EmployeeForm onSubmit={handleCreate} submitLabel="Criar" isCreate />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            )}
          </div>

          <EmployeeTable
            items={items}
            onEdit={(e) => {
              setEditingId(e.id)
              setOpen(true)
            }}
            onDelete={(e) => remove(e.id)}
          />

          <Dialog.Root open={open && !!editingId} onOpenChange={(v) => { if (!v) { setEditingId(null); setOpen(false) } }}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/20" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow">
                <Dialog.Title className="text-lg font-semibold">Editar Employee</Dialog.Title>
                <div className="mt-4">
                  <EmployeeForm defaultValues={editingItem as any} onSubmit={handleUpdate} submitLabel="Salvar" />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </main>
      </div>
    </div>
  )
}


