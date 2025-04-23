/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, LineChart, ClipboardList, Settings, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { NavUser } from "./components/nav-user"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  
]


const NavbarContent: React.FC = ({}) => {
  const pathname = usePathname()

  const { user } = useAuth() // Get user data from auth context
  
  return (
    <nav className="grid grid-cols-3 h-16 items-center px-4 border-b bg-background">
      {/* Logo section */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center text-primary-foreground">
          {/* <Command className="size-4" /> */}
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={32}
            height={32}
            layout="responsive"
          />
        </div>
        <div className="grid text-left text-sm leading-tight">
          <span className="font-semibold">Gimp</span>
          <span className="text-xs">Extensions Repo</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-1 h-full ">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href) && item.href !== '/dashboard')
          
          return (
            <div className={`pb-1 h-full flex items-center transition-colors duration-200 ease-out ${isActive ? "border-b-2 border-white" : ""}`} key={item.href}>
                <Button
                key={item.href}
                variant="ghost"
                className={`gap-2 ${isActive ? " text-white font-bold" : "text-muted-foreground font-light"}`}
                asChild
                >
                <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                </Link>
                </Button>
            </div>
          )
        })}
      </div>

      {/* User menu */}
      <div className="flex justify-end">
        <NavUser user={user} isCollapsed={false} />
      </div>
    </nav>
  )
}


const Navbar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <React.Suspense fallback={null}>
        <NavbarContent />
      </React.Suspense>
    </div>
  )
}

export default Navbar