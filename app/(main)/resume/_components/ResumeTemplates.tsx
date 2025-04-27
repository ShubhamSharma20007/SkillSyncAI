"use client"
import React, { useEffect } from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { LayoutTemplate } from 'lucide-react'
import Handlebars from "handlebars";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import { Templates } from './Templates'
import { toast } from 'sonner'

type Props={
  formValues: any,
  setPreviewContent:React.Dispatch<React.SetStateAction<string>>
}
const ResumeTemplates: React.FC<Props> = ({ formValues ,setPreviewContent}) => {
  const {user} = useUser()
  useEffect(()=>{
    if(user && Boolean(formValues)){
      formValues.contactInfo.name = user?.fullName ?? ''
    }
  },[formValues])

  function applyCustomResumeTemplate(idx:number){
    const { contactInfo, summary, skills, experience, education, projects } = formValues;
    console.log(!contactInfo.name ||!contactInfo.email || !contactInfo.mobile || !summary.trim().length || !skills.trim().length)
    if(!contactInfo.name ||!contactInfo.email || !contactInfo.mobile || !summary.trim().length || !skills.trim().length) toast.warning('Fill in the essential form fields to build your resume.')
    let templateInstance = new Templates(formValues)
    switch (idx) {
      case 1:
        setPreviewContent(templateInstance.firstTemplate().trim() as string)
        break;
      case 2:
        setPreviewContent(templateInstance.secondTemplate().trim() as string)
        break;
      case 3:
        setPreviewContent(templateInstance.thirdTemplate().trim() as string)
        break;
      case 4:
        setPreviewContent(templateInstance.fourthTemplate().trim() as string)
        break;
        case 5:
        setPreviewContent(templateInstance.fifthTemplate().trim() as string)
          break;
      default:
        throw new Error('Invalid template index')
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
      <Button variant={'default'} size={'icon'} className='cursor-pointer' >
          <LayoutTemplate className='w-5 h-5' />
        
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-xl font-bold'>Custom Templates</SheetTitle>
          <div className='grid grid-cols-2 gap-4 mt-5 '>
           {
            Array.from({length:5}).map((_,i)=> <Card
            key={i}
            onClick={()=>{
              applyCustomResumeTemplate(i+1)
            }}
            className='h-44 w-full cursor-pointer flex justify-center group  transition-all duration-300 ease-in-out items-center hover:bg-background/50'>
            <CardTitle>Template {i+1}</CardTitle>
        </Card>)
           }
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default ResumeTemplates