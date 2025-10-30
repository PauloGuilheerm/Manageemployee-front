import { create } from 'zustand'
import { endpoints } from '../api/endpoints'
import type { Employee } from '../api/types'
import toast from 'react-hot-toast'

type State = {
    items: Employee[]
    loading: boolean
    error?: string
}

type Actions = {
    fetch: () => Promise<void>
    getById: (id: string) => Promise<Employee | null>
    create: (data: Partial<Employee>) => Promise<Employee | null>
    update: (id: string, data: Partial<Employee>) => Promise<Employee | null>
    remove: (id: string) => Promise<boolean>
}

export const useEmployeeStore = create<State & Actions>((set, get) => ({
    items: [],
    loading: false,
    error: undefined,

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
            set({ items: [res.data, ...get().items] })
            toast.success('Employee created!')
            return res.data
        } catch {
            toast.error('Erro ao criar employee')
            return null
        }
    },

    update: async (id: string, data: Partial<Employee>) => {
        try {
            const res = await endpoints.employees.update(id, data)
            set({ items: get().items.map((it) => (it.id === id ? res.data : it)) })
            toast.success('Employee updated!')
            return res.data
        } catch {
            toast.error('Erro ao atualizar employee')
            return null
        }
    },

    remove: async (id: string) => {
        try {
            await endpoints.employees.remove(id)
            set({ items: get().items.filter((it) => it.id !== id) })
            toast.success('Deleted successfully')
            return true
        } catch {
            toast.error('Erro ao deletar employee')
            return false
        }
    },
}))


