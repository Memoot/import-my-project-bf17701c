import { LandingPageSection, LandingPage } from "@/data/landingPageTemplates";
import { HeroSection } from "../sections/HeroSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { PricingSection } from "../sections/PricingSection";
import { FAQSection } from "../sections/FAQSection";
import { BonusSection } from "../sections/BonusSection";
import { AboutSection } from "../sections/AboutSection";
import { CTASection } from "../sections/CTASection";
import { GallerySection } from "../sections/GallerySection";
import { ContactSection } from "../sections/ContactSection";
import { CountdownSection } from "../sections/CountdownSection";
import { VideoSection } from "../sections/VideoSection";
import { BlogSection } from "../sections/BlogSection";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, Edit, ArrowUp, ArrowDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DraggableSectionProps {
  section: LandingPageSection;
  page: LandingPage;
  isActive: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onContentChange: (field: string, value: any) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function DraggableSectionRenderer({
  section,
  page,
  isActive,
  isEditing,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onContentChange,
  isFirst,
  isLast,
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const settings = page.settings;

  const sectionProps = {
    content: section.content,
    settings,
    title: section.title,
    isEditing: isEditing, // Always pass isEditing to enable inline editing
    onContentChange,
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection {...sectionProps} />;
      case 'features':
        return <FeaturesSection {...sectionProps} />;
      case 'testimonials':
        return <TestimonialsSection {...sectionProps} />;
      case 'pricing':
        return <PricingSection {...sectionProps} />;
      case 'faq':
        return <FAQSection {...sectionProps} />;
      case 'bonus':
        return <BonusSection {...sectionProps} />;
      case 'about':
        return <AboutSection {...sectionProps} />;
      case 'cta':
        return <CTASection {...sectionProps} />;
      case 'gallery':
        return <GallerySection {...sectionProps} />;
      case 'contact':
        return <ContactSection {...sectionProps} />;
      case 'countdown':
        return <CountdownSection {...sectionProps} />;
      case 'video':
        return <VideoSection {...sectionProps} />;
      case 'blog':
        return <BlogSection {...sectionProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isEditing && "cursor-pointer",
        isActive && isEditing && "ring-4 ring-primary ring-offset-2",
        !isActive && isEditing && "hover:ring-2 hover:ring-primary/50",
        isDragging && "shadow-2xl"
      )}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {/* Section Controls - Always visible on touch, hover on desktop */}
      {isEditing && (
        <div className={cn(
          "absolute top-2 right-2 z-20 flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border p-1",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        )}>
          {/* Drag Handle - Large touch target */}
          <button
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded touch-none"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              // Prevent text selection/scroll from hijacking the gesture on mobile
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="w-px h-6 bg-border" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={isFirst}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={isLast}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Section Label */}
      {isEditing && (
        <div className="absolute top-2 left-2 z-20 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium">
          {section.title}
        </div>
      )}

      {/* Section Content */}
      <div className={cn(isDragging && "pointer-events-none")}>
        {renderSectionContent()}
      </div>

      {/* Drop indicator lines */}
      {isDragging && (
        <>
          <div className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full" />
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
        </>
      )}
    </div>
  );
}
