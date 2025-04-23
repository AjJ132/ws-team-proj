'use client'

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Home, Users, LineChart, ClipboardList, Settings } from 'lucide-react';
import { vw_users } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Players', href: '/players/search', icon: Users },
  { name: 'Team Analysis', href: '/analysis', icon: LineChart },
  { name: 'Roster', href: '/roster', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const TopNavbarContent: React.FC<{ user: vw_users }> = ({ user, ...props }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        setIsCollapsed(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsCollapsed(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`flex flex-col justify-end px-4 border-b !bg-background backdrop-blur transition-all duration-200 ease-out 
        ${isCollapsed ? 'h-14' : 'lg:h-28'}`}
      {...props}
    >
      <div className={`flex items-center w-full transition-all duration-200 ease-out
        ${isCollapsed ? 'h-full' : 'h-12'}
        `}>
        {/* Logo/Home - Always visible */}
        <div className={`flex items-center gap-2 transition-transform duration-200 ease-out
          ${isCollapsed ? 'mt-auto mb-2 scale-90' : 'py-4'}`}>
          <div className={`flex aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-200 ease-out
            ${isCollapsed ? 'size-6' : 'size-8'}`}>
            <Command className={`transition-transform duration-200 ease-out ${isCollapsed ? 'size-3' : 'size-4'}`} />
          </div>
          <div className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-out
            ${isCollapsed ? 'opacity-0 w-0 invisible' : 'opacity-100 w-auto visible'}`}>
            <span className="truncate font-semibold">Prism</span>
            <span className="truncate text-xs">Enterprise</span>
          </div>
        </div>

        {/* Navigation - Will move based on collapse state */}
        <div className={`flex items-center gap-1 ml-0 transition-all duration-200 ease-out transform
          ${isCollapsed ? 'opacity-100 translate-y-0 mt-auto' : 'opacity-0 -translate-y-2'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <div className={`h-full pb-1 transition-colors duration-200 ease-out ${isActive ? "border-b-2 border-white" : ""}`} key={item.href}>
                <Button
                  variant="ghost"
                  className={`gap-2 transition-colors duration-200 ease-out ${isActive ? "text-white font-bold" : "text-muted-foreground font-light"}`}
                  asChild
                >
                  <Link href={item.href}>
                    <span>{item.name}</span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* User menu */}
        {!isCollapsed && (
            <div className={`ml-auto transition-opacity duration-200 ease-out
                ${isCollapsed ? 'opacity-100' : 'opacity-100 visible'}`}>
                <NavUser user={user} isCollapsed={isCollapsed} />
            </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className={`flex items-center gap-1 transition-all duration-200 ease-out transform
        ${isCollapsed ? 'opacity-0 invisible h-0 -translate-y-2' : 'opacity-100 visible h-12 translate-y-0'}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <div className={`h-full pb-1 transition-colors duration-200 ease-out ${isActive ? "border-b-2 border-white" : ""}`} key={item.href}>
              <Button
                variant="ghost"
                className={`gap-2 transition-colors duration-200 ease-out ${isActive ? "text-white font-bold" : "text-muted-foreground font-light"}`}
                asChild
              >
                <Link href={item.href}>
                  <span>{item.name}</span>
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

interface NavbarProps {
  user: vw_users;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <div className="top-0 left-0 right-0 z-40 fixed">
      <React.Suspense fallback={null}>
        <TopNavbarContent user={user} />
      </React.Suspense>
    </div>
  );
}

export default Navbar;