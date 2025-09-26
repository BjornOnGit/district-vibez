"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const dynamic = "force-dynamic"

export default function PaymentVerifyPage() {
  const router = useRouter()
  const params = new URLSearchParams(window.location.search)
  const reference = params.get("reference")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        router.push("/") // No reference → back home
        return
      }

      try {
        const res = await fetch(`/api/verify-payment?reference=${reference}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          console.error("Verification failed:", data.error)
          router.push("/") // Always redirect home
          return
        }

        // ✅ Verification passed
        router.push("/")
      } catch (err) {
        console.error("Error verifying payment:", err)
        router.push("/")
      }
    }

    verifyPayment()
  }, [reference, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Verifying your payment...
      </p>
    </div>
  )
}
