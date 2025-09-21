"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signInAdmin, signUpAdmin } from "@/lib/supabase/auth"

interface AdminLoginProps {
  onSuccess: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log(`[v0] ${mode} submitted with:`, formData.email)

    try {
      if (mode === "signup") {
        await signUpAdmin(formData.email, formData.password)
        toast({
          title: "Signup Successful",
          description: "Admin account created. You can now sign in.",
        })
        setMode("login")
      } else {
        await signInAdmin(formData.email, formData.password)
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        })
        onSuccess()
      }
    } catch (error) {
      console.log(`[v0] ${mode} error caught:`, error)
      toast({
        title: `${mode === "signup" ? "Signup" : "Login"} Failed`,
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">{mode === "signup" ? "Create Admin Account" : "Admin Login"}</CardTitle>
          <p className="text-muted-foreground">
            {mode === "signup" ? "Set up your admin account to manage events" : "Access the event management dashboard"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="mt-1"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "signup" ? "Creating Account..." : "Signing in..."}
                </>
              ) : mode === "signup" ? (
                "Create Admin Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {mode === "login" ? "Need to create an admin account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
