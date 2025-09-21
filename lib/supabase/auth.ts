import { supabase } from "./client"

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at: string
}

export async function signInAdmin(email: string, password: string) {
  console.log("[v0] Attempting admin sign in for:", email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("[v0] Sign in response:", { data, error })

  if (error) {
    console.log("[v0] Sign in error:", error)
    throw error
  }

  // Verify user is an admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (adminError || !adminUser) {
    await supabase.auth.signOut()
    throw new Error("Access denied: Admin privileges required")
  }

  return { user: data.user, adminUser }
}

export async function signUpAdmin(email: string, password: string) {
  console.log("[v0] Attempting admin sign up for:", email)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.log("[v0] Sign up error:", error)
    throw error
  }

  if (data.user) {
    // Create admin user record
    const { error: adminError } = await supabase.from("admin_users").insert({
      id: data.user.id,
      email: data.user.email,
      role: "admin",
    })

    if (adminError) {
      console.log("[v0] Admin user creation error:", adminError)
      throw new Error("Failed to create admin user record")
    }
  }

  return data
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (error || !adminUser) return null
  return adminUser
}
