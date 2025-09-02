"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    title: "Launch Your Campaign",
    image: "/launch.webp",
  },
  {
    title: "Reward Your Supporters",
    image: "/reward.webp",
  },
  {
    title: "Track Your Success",
    image: "/track.webp",
  },
  {
    title: "Join Our Community",
    image: "/community.webp",
  },
];

export default function TransformingIdeasSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const next = () => {
    setStartIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setStartIndex((prev) =>
      (prev - 1 + slides.length) % slides.length
    );
  };

  const getVisibleSlides = () => {
    const extended = [...slides, ...slides];
    return extended.slice(startIndex, startIndex + visibleCount);
  };

  return (
    <section className="py-5 px-25">
      <div className=" mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center flex-1 ml-12">
            Transforming Ideas into Reality
        </h2>
        <div className="flex justify-between items-center mx-14">
          <Button variant="outline" className=" text-green-900 border-green-500">
            <Link href="/campaigns" aria-label="View open fundraising campaigns">
              Discover Our Platform
            </Link>
          </Button>
          <Button className="bg-green-700 hover:bg-green-900 text-white  px-4">
            
            <Link href="/campaigns" aria-label="View open fundraising campaigns">
             Start Your Journey 
            </Link>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={prev} variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-4 overflow-hidden flex-1">
            {getVisibleSlides().map((slide, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden flex-shrink-0 w-1/3 relative"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-80 rounded-xl"
                />
                <div className="absolute bottom-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg max-w-md">
                  <h3 className="text-white font-bold text-lg">{slide.title}</h3>
                  
                </div>
                
              </div>
            ))}
          </div>

          <Button onClick={next} variant="outline" size="icon">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-center text-gray-700 max-w-3xl mx-auto mt-4">
          FundBase is your trusted partner in crowdfunding, ensuring transparency and
          security while empowering your ideas. Engage with supporters, track your
          campaign's progress, and celebrate the success of your project—all in one
          platform.
        </p>
      </div>
    </section>
  );
}
