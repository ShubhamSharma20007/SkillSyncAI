import { getIndustryInsights } from '@/services/dashboard'
import { getUserOnboardingStatus } from '@/services/user'
import { redirect } from 'next/navigation'
import React from 'react'
import { DashboardView } from './_components/DashboardView'
import { Button } from '@/components/ui/button'
import { UserRoundPen } from 'lucide-react'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

export default async function IndustryInsights() {
  const user = await currentUser()
    const [onboardingStatus, insights] = await Promise.all([
        getUserOnboardingStatus(),
        getIndustryInsights(),
    ])

    if(!onboardingStatus.isOnboarded) {
        redirect('/onboarding')
    }
    return (
        <div className='container mx-auto'>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-6xl gradient-title font-bold">Dashboard</h1>
                <Button type='button' variant={'default'} className='cursor-pointer' asChild>
                    <Link href={`/dashboard/${user?.id}`} className="flex items-center gap-2">
                        <UserRoundPen className='w-4 h-4' />
                        Update Profile
                    </Link>
                </Button>
            </div>
            <DashboardView insights={insights} />
        </div>
    )
}
