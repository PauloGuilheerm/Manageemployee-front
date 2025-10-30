import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Employee } from '../api/types'
import { PHONE_TYPES, ROLES } from '../utils/enums'
import { useAuth } from '../auth/useAuth'
import { useMemo } from 'react'
import { can } from '../utils/roles'

const baseSchema = z.object({
  firstName: z.string().min(1, 'Obrigatório'),
  lastName: z.string().min(1, 'Obrigatório'),
  email: z.string().email('Email inválido'),
  docNumber: z.string().min(3, 'Obrigatório'),
  role: z.number().int().min(1).max(3),
  birthDate: z.string().min(1, 'Obrigatório'),
  phones: z.array(
    z.object({
      number: z.string().min(5, 'Obrigatório'),
      type: z.number().int().min(1).max(3),
    })
  ).default([]),
})

export type EmployeeFormValues = z.infer<typeof baseSchema>

export function EmployeeForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Salvar',
  isCreate = false,
}: {
  defaultValues?: Partial<Employee> & { birthDate?: string, password?: string }
  onSubmit: (values: EmployeeFormValues) => void | Promise<void>
  submitLabel?: string
  isCreate?: boolean
}) {
  const toDateInputValue = (value?: string) => {
    if (!value) return ''
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    return value
  }

  const defaultRoleNumeric = (() => {
    const rv = (defaultValues as any)?.role
    if (typeof rv === 'number') return rv
    if (typeof rv === 'string') {
      const v = rv.toLowerCase()
      if (v === 'director') return ROLES.DIRECTOR
      if (v === 'leader') return ROLES.LEADER
      if (v === 'employee') return ROLES.EMPLOYEE
    }
    return ROLES.EMPLOYEE
  })()

  const schema = isCreate
    ? baseSchema.extend({ password: z.string().min(6, 'Mínimo 6 caracteres') })
    : baseSchema

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: ({
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      email: defaultValues?.email ?? '',
      docNumber: defaultValues?.docNumber ?? '',
      role: defaultRoleNumeric,
      birthDate: toDateInputValue((defaultValues as any)?.birthDate),
      password: '',
      phones: (defaultValues as any)?.phones ?? [],
    } as unknown) as any,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'phones' })

  const { user } = useAuth()
  
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
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('firstName')} />
          {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('lastName')} />
          {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Doc number</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('docNumber')} />
          {errors.docNumber && <p className="text-xs text-red-600 mt-1">{errors.docNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Birth date</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" {...register('birthDate')} />
          {errors.birthDate && <p className="text-xs text-red-600 mt-1">{errors.birthDate.message}</p>}
        </div>
        {isCreate && (
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full rounded-md border px-3 py-2" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{(errors as any).password?.message}</p>}
          </div>
        )}
        {can.edit(currentRole as any) && user?.email !== defaultValues?.email && <div>
          <label className="block text-sm font-medium">Role</label>
          <select className="mt-1 w-full rounded-md border px-3 py-2" {...register('role', { valueAsNumber: true })}>
            <option value={ROLES.DIRECTOR}>Director</option>
            <option value={ROLES.LEADER}>Leader</option>
            <option value={ROLES.EMPLOYEE}>Employee</option>
          </select>
          {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>}
        </div>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Phones</h4>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => append({ number: '', type: PHONE_TYPES.MOBILE })}
          >Adicionar</button>
        </div>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
              <div className="md:col-span-3">
                <label className="block text-sm">Número</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2" {...register(`phones.${i}.number` as const)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm">Tipo</label>
                <select className="mt-1 w-full rounded-md border px-3 py-2" {...register(`phones.${i}.type`, { valueAsNumber: true })}>
                  <option value={PHONE_TYPES.MOBILE}>Mobile</option>
                  <option value={PHONE_TYPES.HOME}>Home</option>
                  <option value={PHONE_TYPES.WORK}>Work</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => remove(i)} className="w-full rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm disabled:opacity-50">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}


