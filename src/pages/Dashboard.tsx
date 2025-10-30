import { useEffect, useMemo } from 'react'
import { Navbar } from '../components/ui/Navbar'
import { Sidebar } from '../components/ui/Sidebar'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const { items, fetch, loading, shouldUpdate, clearUpdate } = useEmployeeStore()

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => {
    if (shouldUpdate) {
      fetch().finally(() => clearUpdate())
    }
  }, [shouldUpdate, fetch, clearUpdate])

  const counts = useMemo(() => {
    const total = items.length
    const byRole = items.reduce<Record<string, number>>((acc, e) => {
      acc[e.role] = (acc[e.role] || 0) + 1
      return acc
    }, {})
    const chartData = Object.entries(byRole).map(([name, value]) => ({ name, value }))
    return { total, byRole, chartData }
  }, [items])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          {loading ? (
            <div>Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4">
                <div className="text-sm text-gray-600">Total de funcionários</div>
                <div className="text-2xl font-semibold">{counts.total}</div>
              </motion.div>
              {['Director', 'Leader', 'Employee'].map((r) => (
                <motion.div key={r} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4">
                  <div className="text-sm text-gray-600">{r}</div>
                  <div className="text-2xl font-semibold">{(counts.byRole as any)[r] || 0}</div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-600 mb-2">Funcionários por Role</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={counts.chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


