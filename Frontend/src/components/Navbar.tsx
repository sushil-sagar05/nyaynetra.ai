'use client'
import React from 'react'

function Navbar() {
  return (
    <nav className='p-4 md:p-6  text-black'>
         <div  className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-96'>
         <div className="flex-1 ">
          <a href='#' className="font-bold text-3xl ">👁Nyaynetra</a>
      </div>
      <div className="hidden md:flex gap-6  font-semibold items-center">
      <a href='#' className="font-bold text-3xl ">Pricing</a>
      <a href='#' className="font-bold text-3xl ">About</a>
      <a href='#' className="font-bold text-3xl ">Login</a>
      </div>
         </div>
    </nav>
  )
}

export default Navbar