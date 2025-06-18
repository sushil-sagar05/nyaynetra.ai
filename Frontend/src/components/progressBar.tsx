'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function ProgressBar() {
  const pathname = usePathname()
  useEffect(() => {
    NProgress.start()
    const timeout = setTimeout(() => {
      NProgress.done()
    }, 400)

    return () => {
      clearTimeout(timeout)
      NProgress.done()
    }
  }, [pathname])

  return null
}
