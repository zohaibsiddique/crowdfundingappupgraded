'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const currencySymbols = [
  { symbol: '$', top: '0%', left: '50%' },
  { symbol: '$', top: '50%', left: '100%' },
  { symbol: '$', top: '100%', left: '50%' },
  { symbol: '$', top: '50%', left: '0%' },
];

export default function HeroSection() {
  return (
    <section id='intro' className=" mx-auto flex flex-col lg:flex-row items-center bg-gradient-to-br from-white via-blue-100 to-indigo-100 justify-between py-16 px-25 space-y-15 lg:space-y-0">
      <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Empowering{' '}
            <span className="text-blue-500">Innovative<br className="sm:hidden" /> Ideas</span> Through{' '}
            <span className="text-gray-800">Crowdfunding</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            FundBase connects visionaries with passionate supporters, transforming groundbreaking
            projects into reality. With clear funding goals and secure transactions, we ensure every
            contribution counts toward meaningful change.
          </p>
          <div className="mt-6">
            <Button className="text-white bg-blue-500 hover:bg-blue-700">
              
              <Link href="/campaigns" aria-label="View open fundraising campaigns">
                Fund Now and Make an Impact
              </Link>
              
              <ArrowRight className="ml-2 w-4 h-4" />
              
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-md mb-12 lg:mb-0 flex items-center justify-center">
      {/* Outer Ring with Symbols (rotates) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 100,
          ease: 'linear',
        }}
        className="absolute w-80 h-80 rounded-full border-4 border-blue-400"
      >
        {/* Symbols inside rotating ring */}
        {currencySymbols.map((item, i) => (
          <span
            key={i}
            className="absolute bg-blue-500 text-white text-sm w-7 h-7 flex items-center justify-center rounded-full shadow-md"
            style={{
              top: item.top,
              left: item.left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.symbol}
          </span>
        ))}
      </motion.div>

      {/* Static Inner Circle Image */}
      <div className="relative w-60 h-60 rounded-full overflow-hidden shadow-lg z-10 bg-white">
        <Image
          src="/baig.webp"
          alt="Crowdfunding Coins"
          fill
          className="object-cover"
        />
      </div>
    </div>
    </section>
    
  );
}
