import { create } from 'zustand'
import { endpoints } from '../api/endpoints'
import type { Employee } from '../api/types'
import toast from 'react-hot-toast'

type State = {
  items: Employee[]
  loading: boolean
  error?: string
  shouldUpdate: boolean
}

type Actions = {
  fetch: () => Promise<void>
  getById: (id: string) => Promise<Employee | null>
  create: (data: Partial<Employee>) => Promise<Employee | null>
  update: (employeeId: string, data: Partial<Employee & { isOwner: boolean, newRole: number }>) => Promise<Employee | null>
  remove: (id: string) => Promise<boolean>
  triggerUpdate: () => void
  clearUpdate: () => void
}

export const useEmployeeStore = create<State & Actions>((set, get) => ({
  items: [],
  loading: false,
  error: undefined,
  shouldUpdate: false,

  fetch: async () => {
    set({ loading: true, error: undefined })
    try {
      const { data } = await endpoints.employees.list()
      set({ items: data, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e?.message || 'Erro ao carregar employees' })
      toast.error('Erro ao carregar employees')
    }
  },

  getById: async (id: string) => {
    try {
      const { data } = await endpoints.employees.get(id)
      return data
    } catch {
      toast.error('Erro ao buscar employee')
      return null
    }
  },

  create: async (data: Partial<Employee>) => {
    try {
      const res = await endpoints.employees.create(data)
      const created = res?.data as Employee | undefined
      if (!created?.id) {
        const message = (res?.data as any)?.message || 'Criação não retornou o recurso criado'
        throw new Error(message)
      }
      set({ items: [created, ...get().items] })
      toast.success('Employee created!')
      set({ shouldUpdate: true })
      return created
    } catch (e: any) {
      const msg = e?.message || e?.data?.message || 'Erro ao criar employee'
      toast.error(msg)
      throw e
    }
  },

  update: async (employeeId: string, data: Partial<Employee & { isOwner: boolean }>) => {
    try {
      const res = await endpoints.employees.update(employeeId, { ...data, isOwner: data.isOwner ?? false })
      const updated = res?.data as Employee | undefined
      if (!updated?.id) {
        const message = (res?.data as any)?.message || 'Atualização não retornou o recurso atualizado'
        throw new Error(message)
      }
      set({ items: get().items.map((it) => (it.id === employeeId ? updated : it)) })
      toast.success('Employee updated!')
      set({ shouldUpdate: true })
      return updated
    } catch (e: any) {
      const msg = e?.message || e?.data?.message || 'Erro ao atualizar employee'
      toast.error(msg)
      throw e
    }
  },

  remove: async (id: string) => {
    try {
      await endpoints.employees.remove(id)
      set({ items: get().items.filter((it) => it.id !== id) })
      toast.success('Deleted successfully')
      set({ shouldUpdate: true })
      return true
    } catch (e: any) {
      const msg = e?.message || e?.data?.message || 'Erro ao deletar employee'
      toast.error(msg)
      throw e
    }
  },

  triggerUpdate: () => set({ shouldUpdate: true }),
  clearUpdate: () => set({ shouldUpdate: false }),
}))


