import type { Employee } from '../api/types'
import { can } from '../utils/roles'
import * as Dialog from '@radix-ui/react-dialog'

export function EmployeeTable({
    items,
    onEdit,
    onDelete,
    currentRole,
}: {
    items: Employee[]
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
    currentRole: 'Director' | 'Leader' | 'Employee' | string
}) {
    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((e) => (
                        <tr key={e.id} className="border-t">
                            <td className="px-4 py-2">{e.firstName} {e.lastName}</td>
                            <td className="px-4 py-2">{e.email}</td>
                            <td className="px-4 py-2">{e.role}</td>
                            <td className="px-4 py-2 text-right">
                                <div className="inline-flex gap-2">
                                    {can.edit(currentRole as any) && (
                                        <button
                                            className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50"
                                            onClick={() => onEdit(e)}
                                        >Editar</button>
                                    )}

                                    {can.remove(currentRole as any) && (
                                        <ConfirmButton
                                            label="Excluir"
                                            onConfirm={() => onDelete(e)}
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ConfirmButton({ label, onConfirm }: { label: string; onConfirm: () => void }) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="rounded-md border px-3 py-1.5 text-xs text-red-700 border-red-300 hover:bg-red-50">{label}</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow">
                    <Dialog.Title className="text-base font-medium">Confirmar exclusão</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-gray-600">
                        Esta ação é irreversível.
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Cancelar</button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button onClick={onConfirm} className="rounded-md bg-red-600 text-white px-3 py-1.5 text-sm">Excluir</button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}


