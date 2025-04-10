"use client"
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { customInterviewValidation, onboardingSchema } from '@/lib/Schema'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/user-fetch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateUser } from '@/services/user'
import { trusted } from 'mongoose'
const difficultyLevel = [
    {
        value: "beginner",
        label: 'Beginner'
    },
    {
        value: "intermediate",
        label: 'Intermediate'
    },
    {
        value: "advanced",
        label: 'Advanced'
    }

]
const timerArray = [
    {
        value: "15",
        label: '15 minutes'
    },
    {
        value: "30",
        label: '30 minutes'
    },
    {
        value: "45",
        label: '45 minutes'
    },
    {
        value: "60",
        label: '60 minutes'
    }
]
const LanguagePrefrence = [
    {
        value: 'english',
        label: 'English'
    },
    {
        value: 'hindi',
        label: 'Hindi'
    }
]
const CustomInterviewForm = () => {
    const [bedgeValue, setBagdeValue] = useState('15 minutes')
    const { control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        register,
        formState: { errors, isValid } } = useForm({
            resolver: zodResolver(customInterviewValidation),
            defaultValues: {
                difficultyLevel: '',
                questionCount: 10,
                language: "english",
                skills: '',
                isTimer: false,
                experienceLevel:'',
                timerValue: ''
            }
        })

    const isTimer = watch('isTimer')

    const onSubmit = async (data: any) => {
        console.log(data)
    }
    console.log(isTimer)
    useEffect(() => {
        if (!isTimer) {
            setValue('timerValue', '')
        } else {
            setValue('timerValue', bedgeValue)
        }

    }, [isTimer])
    return (
        <div className='flex justify-center items-center bg-background'>
            <Card className='w-full max-w-lg  mx-2'>
                <CardHeader>
                    <CardTitle className='gradient-title text-4xl'>Custom Interview Form</CardTitle>
                    <CardDescription>
                        Fill in the form to create your custom interview questions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='space-y-6'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className='space-y-3'>
                            <Label htmlFor="industry">Difficulty Level</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue('difficultyLevel', value)
                                }}>
                                <SelectTrigger id='industry' className='w-full'>
                                    <SelectValue placeholder="Select Difficulty Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        difficultyLevel.map((level, idx) => <SelectItem value={level.value} key={idx}>{level.label}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                            {
                                errors.difficultyLevel && (
                                    <p className='text-sm text-red-500'>
                                        {errors.difficultyLevel.message}
                                    </p>
                                )
                            }
                        </div>



                        {/* question count */}
                        <div className='space-y-3'>
                            <Label htmlFor="question-count" >Number of quesiton</Label>
                            <Input
                                id='question-count'
                                type='number'
                                placeholder='10'
                                {...register('questionCount', { valueAsNumber: true })}

                            ></Input>
                            {
                                errors.questionCount && (
                                    <p className='text-sm text-red-500'>
                                        {errors.questionCount.message}
                                    </p>
                                )
                            }
                        </div>
                        {/* Experience */}
                        <div className='space-y-3'>
                            <Label htmlFor="experienceLevel">Experience Level</Label>
                            <Select onValueChange={(value) => setValue('experienceLevel', value)}>
                                <SelectTrigger id='experienceLevel' className='w-full'>
                                    <SelectValue placeholder="Select Experience Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Fresher', 'Mid-level', 'Senior'].map((level, idx) => (
                                        <SelectItem key={idx} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {
                                errors.experienceLevel && (
                                    <p className='text-sm text-red-500'>
                                        {errors.experienceLevel.message}
                                    </p>
                                )
                            }
                        </div>
                       
                        {/* Perferred Language*/}
                        <div className='space-y-3'>
                            <Label htmlFor="language">Preferred Language</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue('language', value)
                                }}>
                                <SelectTrigger id='industry' className='w-full'>
                                    <SelectValue placeholder="Select Prefered Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        LanguagePrefrence.map((lang, idx) => <SelectItem value={lang.value} key={idx}>{lang.label}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>

                        </div>

                        <div className='space-y-3'>
                            <Label htmlFor="skills" >Skills</Label>
                            <Input
                                id='skills'
                                type='text'
                                placeholder='Ex. Python, Javascript, Project Manager etc'
                                {...register('skills')}

                            ></Input>
                            <p className='text-xs text-muted-foreground'>
                                Separate multiple skills with commas
                            </p>

                            {
                                errors.skills && (
                                    <p className='text-sm text-red-500'>
                                        {errors.skills.message}
                                    </p>
                                )
                            }
                        </div>

                        <div className='space-y-3'>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="isTimer"
                                    render={({ field: { onChange, value } }) => (
                                        <Switch
                                            id="add-timer"
                                            checked={value}
                                            onCheckedChange={onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="add-timer">Do you want to add timer?</Label>
                            </div>
                        </div>
                        {
                            isTimer && (
                                <div className='grid grid-cols-4 gap-10 mt-5 self-center justify-self-center'>
                                    {timerArray.map((item) => (
                                        <Badge
                                            key={item.value}
                                            onClick={() => setValue('timerValue', item.label)}
                                            className='text-[12.5px] cursor-pointer'
                                            variant={watch('timerValue') === item.label ? 'default' : 'outline'}
                                        >
                                            {item.label}
                                        </Badge>
                                    ))}
                                </div>
                            )
                        }
                        <Button
                            //  disabled={}
                            className='w-full cursor-pointer' type='submit'>
                            {
                                false ?
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'>Saving...</Loader2>
                                    : 'Create Interview'
                            }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CustomInterviewForm