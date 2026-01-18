import { LeadForm } from "@/components/lead-form"
import { BenefitsSection } from "@/components/benefits-section"
import { FeaturedPropertiesSection } from "@/components/FeaturedPropertiesSection"
import { TestimonialsSection } from "@/components/testimonials"
import { HeroSection } from "@/components/HeroSection"
import { ServicesSection } from "@/components/ServicesSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
      <section id="lead-form" className="py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 bg-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 text-foreground">Cuéntanos tu necesidad</h2>
          <LeadForm />
        </div>
      </section>
    </div>
  )
}