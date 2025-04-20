'use client'
import React, { useEffect, useState } from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon, Moon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)


  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className='sticky top-5 z-20'>
      <header className="flex justify-between items-center bg-muted/50 p-4 gap-4 h-16 backdrop-blur-xs shadow-muted py-5 my-2 sm:my-5 mx-1 sm:mx-5 rounded-xl">
        <nav>
          <Link href={'/'}>
            <p className='gredient-title  text-xl sm:text-2xl whitespace-nowrap font-medium tracking-wide '><span className='text-3xl text-primary'>S</span>killSynx Ai</p>
          </Link>
        </nav>

        <div className='flex items-center space-x-3'>
          <SignedIn>
            <Button variant={'outline'} asChild>
              <Link href={'/dashboard'}>
                <LayoutDashboard className='h-4 w-4' />
                <span className='hidden md:block'> Industry Insign</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarsIcon className='h-4 w-4' />
                  <span className='hidden md:block'>Growth Tools</span>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={'/resume'} className='flex items-center gap-2'>
                    <FileText className='h-4 w-4' />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/ai-cover-letter'} className='flex items-center gap-2'>
                    <PenBox className='h-4 w-4' />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/interview'} className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4' />
                    <span>Interview Prep.</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button className='cursor-pointer text-md' variant={'outline'}>Sign In</Button>
            </SignInButton>
          </SignedOut>

          {/* Theme toggle */}
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {mounted && (
              resolvedTheme === 'dark'
                ? <Sun className="h-[1.2rem] w-[1.2rem]" />
                : <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <SignedIn>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12",
                  userButtonPopoverCard: 'shadow-xl',
                  userPreviewMainIdentifier: 'font-semibold'
                },
              }}
            />
          </SignedIn>
        </div>
      </header>
    </div>
  )
}
