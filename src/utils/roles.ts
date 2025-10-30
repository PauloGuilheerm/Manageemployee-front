export type AppRole = 'Director' | 'Leader' | 'Employee'

export const can = {
    create: (role: AppRole) => role === 'Director' || role === 'Leader',
    edit: (role: AppRole) => role === 'Director' || role === 'Leader',
    remove: (role: AppRole) => role === 'Director',
    read: () => true,
}


