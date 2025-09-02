'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
 
  {
    image: "/support.webp",
    title: "Trusted Supporters",
    subtitle: "Growing Backers",
    description: "Build lasting connections through reliable engagement.",
  },
  {
    image: "/growth.webp",
    title: "Sustainable Growth",
    subtitle: "Long-Term Impact",
    description: "Drive community-led progress with continuous innovation.",
  },
   {
    image: "/reward.webp",
    title: "Impactful Rewards",
    subtitle: "Incentives for Support",
    description:
      "Acknowledging contributions with tailored rewards for each level.",
  },
];

export default function SliderSection() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((current - 1 + slides.length) % slides.length);

  const { image, title, subtitle, description } = slides[current];

  return (
    <section className="py-12 px-25">
      <div className="">
        <div className="rounded-2xl overflow-hidden relative">
          <div className="w-full h-120 relative">
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
            <div className="absolute top-4 left-4 px-6 py-2 text-white text-xl font-semibold bg-white/20 backdrop-blur-sm rounded-lg">
              {title}
            </div>
            <div className="absolute bottom-4 left-4 p-4 bg-white/20 backdrop-blur-sm rounded-lg max-w-md">
              <h3 className="text-white font-bold text-lg">{subtitle}</h3>
              <p className="text-white text-sm">{description}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-700 mt-4 max-w-xl mx-auto">
          Amplify your project's reach by harnessing the power of community funding.
        </p>
        <div className="flex justify-center items-center gap-4 mt-6">
          
          <Button variant="outline" size="icon" onClick={prevSlide}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" className="" onClick={nextSlide}>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
