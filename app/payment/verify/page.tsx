"use client"

import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState("Verifying payment...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference")
    const email = params.get("email") // <-- extract email from URL

    if (reference && email) {
      fetch(`/api/verify-payment?reference=${reference}&email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setStatus(`❌ ${data.error}`)
          } else if (data.status === "success") {
            setStatus("✅ Payment successful! Ticket sent to your email.")
          } else {
            setStatus(`⚠️ Payment status: ${data.status}`)
          }
        })
        .catch(() => {
          setStatus("⚠️ Something went wrong during verification")
        })
    } else {
      setStatus("⚠️ Missing payment reference or email")
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow rounded text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        {status.startsWith("✅") && (
          <p className="text-gray-600">
            Your ticket has been emailed to you. Please check your inbox 📩
          </p>
        )}
      </div>
    </div>
  )
}
