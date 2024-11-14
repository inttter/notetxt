import React from 'react'
import Head from 'next/head'
import Badge from '@/components/Landing/Badge'
import HeroSection from '@/components/Landing/Hero'
import FeatureCards from '@/components/Landing/Card'
import FAQSection from '@/components/Landing/FAQ'
import Footer from '@/components/Landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#141414" />
      </Head>
      <div className="relative min-h-screen w-full bg-[#101010] overflow-x-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-[-300px] -translate-x-1/2 h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#4f4f4f40,transparent)]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen antialiased scroll-smooth p-4 md:p-8">
          <main className="flex-grow">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 flex-col">
              <Badge />
              <HeroSection />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <FeatureCards />
              </div>
              <FAQSection />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}