import { http } from './http'
import type { Employee } from './types'

export const endpoints = {
  login: (payload: { docNumber: string; password: string }) =>
    http.post<{ token: string }>('/auth/login', payload),

  employees: {
    list: () => http.get<Employee[]>('/employees'),
    get: (id: string) => http.get<Employee>(`/employees/${id}`),
    me: () => http.get<Employee>('/employees/me'),
    create: (data: Partial<Employee>) => http.post<Employee>('/employees', data),
    update: (id: string, data: Partial<Employee>) => http.put<Employee>(`/employees/${id}`, data),
    remove: (id: string) => http.delete<void>(`/employees/${id}`),
  },
}


