"use client"

import { useAdminAuth } from "../../hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => window.location.reload()} />
  }

  return <AdminDashboard onLogout={() => window.location.reload()} />
}
