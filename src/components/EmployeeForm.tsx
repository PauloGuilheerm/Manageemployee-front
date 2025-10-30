import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Employee } from '../api/types'

const schema = z.object({
    firstName: z.string().min(1, 'Obrigatório'),
    lastName: z.string().min(1, 'Obrigatório'),
    email: z.string().email('Email inválido'),
    docNumber: z.string().min(3, 'Obrigatório'),
    role: z.enum(['Director', 'Leader', 'Employee']),
    phones: z.array(
        z.object({
            number: z.string().min(5, 'Obrigatório'),
            type: z.enum(['Mobile', 'Home', 'Work']),
        })
    ).default([]),
})

export type EmployeeFormValues = z.output<typeof schema>

export function EmployeeForm({
    defaultValues,
    onSubmit,
    submitLabel = 'Salvar',
}: {
    defaultValues?: Partial<Employee>
    onSubmit: (values: EmployeeFormValues) => void | Promise<void>
    submitLabel?: string
}) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EmployeeFormValues>({
        // Cast para compatibilidade com @hookform/resolvers atual
        resolver: zodResolver(schema) as any,
        defaultValues: (defaultValues ?? { phones: [] }) as any,
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'phones' })

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
                    <label className="block text-sm font-medium">Role</label>
                    <select className="mt-1 w-full rounded-md border px-3 py-2" {...register('role')}>
                        <option value="Director">Director</option>
                        <option value="Leader">Leader</option>
                        <option value="Employee">Employee</option>
                    </select>
                    {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Phones</h4>
                    <button
                        type="button"
                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                        onClick={() => append({ number: '', type: 'Mobile' })}
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
                                <select className="mt-1 w-full rounded-md border px-3 py-2" {...register(`phones.${i}.type` as const)}>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
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


