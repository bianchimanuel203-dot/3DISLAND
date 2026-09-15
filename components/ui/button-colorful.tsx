'use client'
import React from 'react'

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export default function ButtonColorful({ className = "", children, ...props }: ButtonColorfulProps) {
  return (
    <button
      className={`group relative overflow-hidden rounded-full px-8 text-sm font-bold tracking-wide text-white transition-all duration-200 ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-[#9B7DD4] to-purple-600 opacity-90 group-hover:opacity-100 blur transition-opacity duration-500" />
      <div className="relative flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  )
}