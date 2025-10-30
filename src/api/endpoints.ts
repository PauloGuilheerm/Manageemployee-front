import { http } from './http'
import type { Employee } from './types'

function normalizeEmployeePayload(data: Partial<Employee> & { birthDate?: string; password?: string }) {
  const payload: any = { ...data }
  if (payload.birthDate) {
    const iso = new Date(`${payload.birthDate}T00:00:00Z`).toISOString()
    payload.birthDate = iso
  }
  return payload
}

export const endpoints = {
  login: (payload: { docNumber: string; password: string }) =>
    http.post<{ token: string }>('/auth/login', payload),

  employees: {
    list: () => http.get<Employee[]>('/employees'),
    get: (id: string) => http.get<Employee>(`/employees/${id}`),
    getByEmail: (email: string) => http.get<Employee>(`/employees/byEmail/${email}`),
    create: (data: Partial<Employee> & { birthDate?: string; password?: string }) =>
      http.post<Employee>('/employees', normalizeEmployeePayload(data)),
    update: (employeeId: string, data: Partial<Employee> & { birthDate?: string; password?: string, isOwner: boolean }) =>
      http.put<Employee>(`/employees/${employeeId}`, normalizeEmployeePayload(data)),
    remove: (id: string) => http.delete<void>(`/employees/${id}`),
  },
}


