"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { motion } from "motion/react";
export default function HeroSection() {
  const imageRef = useRef<HTMLDivElement | null>(null)
  useEffect(()=>{
   const handleScroll =()=>{
    const scrollPostion = window.scrollY;
    const scrollThreshold = 100;
    if(scrollPostion > scrollThreshold){
      imageRef.current?.classList.add('scrolled')
    }else{
      imageRef.current?.classList.remove('scrolled')
    }
   }
   window.addEventListener('scroll',handleScroll)
   return ()=>{
    window.removeEventListener('scroll',handleScroll)
   }
  
  },[])
  return (
    <section className='w-full pt-24 md:pt-28 pb-10 overflow-hidden bg-gradient-to-b'>
      <div className=' space-y-6 text-center'>
      <div className='space-y-6 mx-auto'>
        <h1 className='gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl'>Your Personal AI <span>
          Assistant
        {/* <span className="">
        <h1 className="max-w-2xl text-center text-5xl leading-snug inline-block">
        <span className="relative gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl">
          Assistant
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="var(--stroke-color)"
              strokeWidth="2"
            />
          </svg>
        </span>{" "}
 
      </h1>
      </span> */}
          </span> for
        <br />
        Professional Success
        </h1>
        <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>Advance your career with personalized guidance, interview prep, and  AI-powered tools for job success.</p>
      </div>
      <div>
        <Button size={'lg'} className='px-8' asChild>
        <Link href={'/dashboard'}>
          Get Started
        </Link>
        </Button>
      </div>

      <div className='hero-image-wrapper mt-5 md:mt-0'>
        <div ref={imageRef} className='hero-image'>
          <Image alt='banner img' src="/banner.jpeg" width={1280} height={720} className='rounded-lg shadow-2xl border mx-auto' priority></Image>
        </div>
      </div>
      </div>

    </section>
  )
}
