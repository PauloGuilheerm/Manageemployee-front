import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../auth/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const schema = z.object({
  docNumber: z.string().min(3, 'Informe o documento'),
  password: z.string().min(3, 'Informe a senha'),
})

type Values = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) })

  async function onSubmit(values: Values) {
    try {
      await login(values.docNumber, values.password)
      toast.success('Autenticado!')
      navigate('/')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Credenciais inválidas')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-gray-600 mt-1">Use seu docNumber e senha.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Documento</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('docNumber')} />
            {errors.docNumber && <p className="text-xs text-red-600 mt-1">{errors.docNumber.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input type="password" className="mt-1 w-full rounded-md border px-3 py-2" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="w-full rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-50">Entrar</button>
        </form>
      </div>
    </div>
  )
}


