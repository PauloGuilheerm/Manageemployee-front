import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AuthProvider } from '../auth/AuthContext'
import { Toaster } from 'react-hot-toast'

const Login = lazy(() => import('../pages/Login'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Employees = lazy(() => import('../pages/Employees'))
const Profile = lazy(() => import('../pages/Profile'))
const EmployeeFormPage = lazy(() => import('../pages/EmployeeForm'))

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <Login />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<div className="p-8">Carregando...</div>}>
                    <Dashboard />
                </Suspense>
            </ProtectedRoute>
        ),
    },
    {
        path: '/employees',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<div className="p-8">Carregando...</div>}>
                    <Employees />
                </Suspense>
            </ProtectedRoute>
        ),
    },
    {
        path: '/employees/new',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<div className="p-8">Carregando...</div>}>
                    <EmployeeFormPage />
                </Suspense>
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<div className="p-8">Carregando...</div>}>
                    <Profile />
                </Suspense>
            </ProtectedRoute>
        ),
    },
])

export function AppRouter() {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <RouterProvider router={router} />
        </AuthProvider>
    )
}


