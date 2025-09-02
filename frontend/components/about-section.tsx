import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-12 px-4 lg:px-25 grid grid-cols-1 md:grid-cols-2 items-center gap-20">
      {/* Left Section */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-black">About FundBase</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Empowering Your Vision <br />
          <span className="text-blue-500">Through Crowdfunding Excellence.</span>
        </h3>
        <p className="mt-4 text-gray-600">
          FundBase connects innovative projects with passionate supporters. With transparent goals and secure transactions, we facilitate your journey from concept to reality, ensuring that your vision is backed by those who believe in it.
        </p>
      </div>

      {/* Right Section with image and overlay cards */}
      <div className="relative rounded-3xl overflow-hidden">
        <Image
          src="/about.webp" // Replace with your actual image path
          alt="About FundBase"
          width={800}
          height={600}
          className="rounded-3xl object-cover"
        />

        {/* Top Card */}
        <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-white font-medium text-lg shadow">
          Launching Campaigns
        </div>

        {/* Bottom Card */}
        <div className="absolute bottom-4 left-4 bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-white shadow">
          <p className="font-semibold text-base">Nurturing Ideas</p>
          <p className="text-sm">Paving the way for innovative solutions through community support.</p>
        </div>
      </div>
    </section>
  )
}
