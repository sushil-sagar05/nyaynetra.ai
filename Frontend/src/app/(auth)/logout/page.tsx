'use client'
import axios from 'axios';
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"
function page() {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((response) => {
          if (response.status === 200) {
            localStorage.removeItem('token');
            router.push('/login')
          }
        }).catch((error) => {
          console.error('Error logging out:', error);
          router.push('/login')
        });
      }, [router]);
  return (
    <div>page</div>
  )
}

export default page