"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const [status, setStatus] = useState("Verifying...")

  useEffect(() => {
    if (reference) {
      fetch(`/api/verify-payment?reference=${reference}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status)
        })
        .catch(() => {
          setStatus("Verification failed")
        })
    }
  }, [reference])

  return (
    <div className="p-6 text-center">
      <h1>{status}</h1>
    </div>
  )
}