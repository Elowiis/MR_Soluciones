import { MessageCircle } from "lucide-react"
import { LeadForm } from "@/components/lead-form"
import { BenefitsSection } from "@/components/benefits-section"
import { FeaturedPropertiesSection } from "@/components/FeaturedPropertiesSection"
import { TestimonialsSection } from "@/components/testimonials"
import { HeroSection } from "@/components/HeroSection"


export default function Home() {
  return (
    <div className="w-full min-w-full min-h-screen bg-background">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 3. Featured Properties */}
      <section id="featured-properties">
        <FeaturedPropertiesSection />
      </section>

      {/* 4. Benefits Section */}
      <BenefitsSection />

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. Lead Form Section */}
      <section
        id="lead-form"
        className="relative py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50/70 overflow-hidden"
      >
        {/* Blobs decorativos, consistentes con Benefits/Testimonials */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <MessageCircle className="w-4 h-4" />
              Hablemos
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Cuéntanos tu necesidad
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Compra, venta o alquiler: cuéntanos qué buscas y te acompañamos en cada paso
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </div>
  )
}