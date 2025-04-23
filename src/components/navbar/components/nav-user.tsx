'use client'

import { ChevronsUpDown } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SignOutItem } from "./sign-out-item"
import { UserTokenResponseDto } from "@/types/interfaces"

interface NavUserProps {
  user: UserTokenResponseDto | null;
  isCollapsed?: boolean;
}

export function NavUser({ user, isCollapsed = false }: NavUserProps) {
  if (!user) {
    return null
  }

  console.log('user', user)

  return (
    <div className="flex gap-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`h-12 flex items-center gap-2 ${isCollapsed ? 'px-0 w-4 hover:bg-transparent invisible' : 'px-2'}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={`/${user.username}.jpg`} 
                alt={user.username}
                className="object-cover"
              />
              <AvatarFallback>
                {user.username.charAt(0)}{user.username.charAt(1)}
              </AvatarFallback>
            </Avatar>
            <div className={`grid flex-1 text-left text-sm leading-tight transition-all duration-300
              ${isCollapsed ? 'w-0 opacity-0 invisible' : 'w-auto opacity-100 visible'}`}>
              <span className="truncate font-semibold">{user.username}</span>
            </div>
            <ChevronsUpDown className={`size-4 transition-all duration-300
              ${isCollapsed ? 'w-0 opacity-0 invisible' : 'w-auto opacity-100 visible ml-2'}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-40" 
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutItem />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}