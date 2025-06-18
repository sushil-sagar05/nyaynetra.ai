'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.start()
    // Stop progress bar after 300-500ms (or customize)
    const timeout = setTimeout(() => {
      NProgress.done()
    }, 400)

    return () => {
      clearTimeout(timeout)
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}
