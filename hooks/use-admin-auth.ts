"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase/client"
import { getCurrentAdminUser, type AdminUser } from "../lib/supabase/auth"

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getCurrentAdminUser().then((adminUser) => {
      setUser(adminUser)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const adminUser = await getCurrentAdminUser()
        setUser(adminUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, isAdmin: !!user }
}
