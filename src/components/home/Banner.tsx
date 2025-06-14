'use client'

import { HeroForm } from './HeroForm'

export function Banner() {
  return (
    <section className='bg-gradient-to-r from-primary-400 to-blue-300 py-16 relative'>
      <div className='container mx-auto max-w-full'>
        <div className='flex flex-col text-center max-w-full'>
          <div className='relative z-10'>
            <h1 className='mt-4 font-semibold text-[40px] lg:text-7xl xl:text-7xl leading-tight text-secondary-700'>
              Fix Your Instagram in 10 Minutes
            </h1>
            <div className='text-lg lg:text-xl xl:text-3xl text-white mt-8'>
              Improve your profile with AI-powered tips and grow your audience fast.
            </div>
            <HeroForm />
          </div>
        </div>
      </div>
    </section>
  )
}
