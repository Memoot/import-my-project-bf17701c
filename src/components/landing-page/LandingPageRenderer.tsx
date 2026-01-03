import { LandingPageSection, LandingPage } from "@/data/landingPageTemplates";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { PricingSection } from "./sections/PricingSection";
import { FAQSection } from "./sections/FAQSection";
import { BonusSection } from "./sections/BonusSection";
import { AboutSection } from "./sections/AboutSection";
import { CTASection } from "./sections/CTASection";
import { GallerySection } from "./sections/GallerySection";
import { ContactSection } from "./sections/ContactSection";
import { CountdownSection } from "./sections/CountdownSection";
import { VideoSection } from "./sections/VideoSection";
import { BlogSection } from "./sections/BlogSection";

interface LandingPageRendererProps {
  page: LandingPage;
  isEditing?: boolean;
  activeSection?: string | null;
  onSectionClick?: (sectionId: string) => void;
  onContentChange?: (sectionId: string, field: string, value: any) => void;
}

export function LandingPageRenderer({ 
  page, 
  isEditing = false, 
  activeSection,
  onSectionClick,
  onContentChange 
}: LandingPageRendererProps) {
  const renderSection = (section: LandingPageSection) => {
    const isActive = activeSection === section.id;
    const settings = page.settings;
    
    const wrapperClass = isEditing 
      ? `relative cursor-pointer transition-all ${isActive ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'}`
      : '';

    const handleContentChange = (field: string, value: any) => {
      onContentChange?.(section.id, field, value);
    };

    const sectionProps = {
      content: section.content,
      settings,
      title: section.title,
      isEditing: isActive && isEditing,
      onContentChange: handleContentChange,
    };

    const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
      <div 
        className={wrapperClass}
        onClick={(e) => {
          if (isEditing) {
            e.stopPropagation();
            onSectionClick?.(section.id);
          }
        }}
      >
        {isEditing && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
            {section.title}
          </div>
        )}
        {children}
      </div>
    );

    switch (section.type) {
      case 'hero':
        return (
          <SectionWrapper key={section.id}>
            <HeroSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'features':
        return (
          <SectionWrapper key={section.id}>
            <FeaturesSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'testimonials':
        return (
          <SectionWrapper key={section.id}>
            <TestimonialsSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'pricing':
        return (
          <SectionWrapper key={section.id}>
            <PricingSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'faq':
        return (
          <SectionWrapper key={section.id}>
            <FAQSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'bonus':
        return (
          <SectionWrapper key={section.id}>
            <BonusSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'about':
        return (
          <SectionWrapper key={section.id}>
            <AboutSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'cta':
        return (
          <SectionWrapper key={section.id}>
            <CTASection {...sectionProps} />
          </SectionWrapper>
        );
      case 'gallery':
        return (
          <SectionWrapper key={section.id}>
            <GallerySection {...sectionProps} />
          </SectionWrapper>
        );
      case 'contact':
        return (
          <SectionWrapper key={section.id}>
            <ContactSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'countdown':
        return (
          <SectionWrapper key={section.id}>
            <CountdownSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'video':
        return (
          <SectionWrapper key={section.id}>
            <VideoSection {...sectionProps} />
          </SectionWrapper>
        );
      case 'blog':
        return (
          <SectionWrapper key={section.id}>
            <BlogSection {...sectionProps} />
          </SectionWrapper>
        );
      default:
        return null;
    }
  };

  // Sort sections by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="font-cairo" dir={page.settings.direction}>
      {sortedSections.map(section => renderSection(section))}
      
      {/* Footer */}
      <footer 
        className="py-6 px-6 text-center text-white text-sm"
        style={{ backgroundColor: page.settings.primaryColor }}
      >
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
