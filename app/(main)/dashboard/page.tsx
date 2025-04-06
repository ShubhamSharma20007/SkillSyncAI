import { getIndustryInsights } from '@/services/dashboard'
import { getUserOnboardingStatus } from '@/services/user'
import { redirect } from 'next/navigation'
import React from 'react'
import { DashboardView } from './_components/DashboardView'

export default async function IndustryInsights() {
    const {isOnboarded} = await getUserOnboardingStatus()
   const insights = await getIndustryInsights()
   console.log("insights",insights)
    if(!isOnboarded) {
      redirect('/onboarding')
    }
  return (
   <div className='container mx-auto'>
    <DashboardView insights={insights}/>
   </div>
  )
}
