import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditableText } from "../editor/EditableText";
import { EditableButton } from "../editor/EditableButton";

interface HeroSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    buttonText?: string;
    buttonUrl?: string;
    backgroundType?: string;
    backgroundImage?: string;
    badge?: string;
    style?: 'modern' | 'classic' | 'gradient' | 'minimal' | 'bold' | 'elegant' | 'dynamic' | 'professional';
    layout?: 'center' | 'left' | 'right' | 'split';
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function HeroSection({ content, settings, isEditing, onContentChange }: HeroSectionProps) {
  const style = content.style || 'modern';
  const layout = content.layout || 'center';
  
  // Generate dynamic styles based on template style
  const getStyleClasses = () => {
    switch (style) {
      case 'bold':
        return {
          container: 'min-h-[600px] relative overflow-hidden',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.primaryColor}DD 50%, ${settings.secondaryColor} 100%)`,
          headline: 'text-5xl md:text-7xl font-black tracking-tight',
          subheadline: 'text-xl md:text-2xl font-light opacity-90',
          button: 'text-xl px-12 py-7 rounded-full font-bold shadow-2xl hover:scale-110 transition-all duration-300',
        };
      case 'elegant':
        return {
          container: 'min-h-[550px] relative',
          background: `linear-gradient(180deg, ${settings.primaryColor}F5 0%, ${settings.primaryColor} 100%)`,
          headline: 'text-4xl md:text-6xl font-serif font-medium tracking-wide',
          subheadline: 'text-lg md:text-xl font-light tracking-widest uppercase opacity-80',
          button: 'text-lg px-10 py-5 rounded-none border-2 border-white bg-transparent hover:bg-white hover:text-gray-900 transition-all duration-500',
        };
      case 'dynamic':
        return {
          container: 'min-h-[650px] relative overflow-hidden',
          background: `linear-gradient(45deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 50%, ${settings.primaryColor} 100%)`,
          headline: 'text-5xl md:text-6xl font-extrabold italic',
          subheadline: 'text-xl md:text-2xl font-medium',
          button: 'text-lg px-10 py-6 rounded-2xl font-bold transform hover:rotate-1 hover:scale-105 transition-all duration-300 shadow-xl',
        };
      case 'professional':
        return {
          container: 'min-h-[500px] relative',
          background: `linear-gradient(to right, ${settings.primaryColor} 0%, ${settings.primaryColor}EE 100%)`,
          headline: 'text-4xl md:text-5xl font-semibold',
          subheadline: 'text-lg md:text-xl font-normal opacity-90',
          button: 'text-base px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
        };
      case 'minimal':
        return {
          container: 'min-h-[450px] relative',
          background: settings.primaryColor,
          headline: 'text-3xl md:text-5xl font-light tracking-wide',
          subheadline: 'text-base md:text-lg font-light opacity-75',
          button: 'text-sm px-6 py-3 rounded-sm font-medium border border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 transition-all',
        };
      case 'gradient':
        return {
          container: 'min-h-[550px] relative overflow-hidden',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
          headline: 'text-4xl md:text-6xl font-bold bg-clip-text',
          subheadline: 'text-lg md:text-xl font-normal',
          button: 'text-lg px-8 py-5 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300',
        };
      case 'classic':
        return {
          container: 'min-h-[500px] relative',
          background: settings.primaryColor,
          headline: 'text-4xl md:text-5xl font-bold',
          subheadline: 'text-lg md:text-xl',
          button: 'text-lg px-8 py-4 rounded-md font-medium shadow-md hover:shadow-lg transition-shadow',
        };
      default: // modern
        return {
          container: 'min-h-[550px] relative overflow-hidden',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.primaryColor}CC 100%)`,
          headline: 'text-4xl md:text-6xl font-bold',
          subheadline: 'text-lg md:text-xl font-normal opacity-90',
          button: 'text-lg px-8 py-5 rounded-xl font-semibold shadow-xl hover:scale-105 transition-all duration-300',
        };
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'left':
        return 'text-right items-end';
      case 'right':
        return 'text-left items-start';
      case 'split':
        return 'text-center items-center md:text-right md:items-end';
      default:
        return 'text-center items-center';
    }
  };

  const styles = getStyleClasses();
  const textAlign = layout === 'left' ? 'right' : layout === 'right' ? 'left' : 'center';
  
  return (
    <section 
      className={cn("flex items-center justify-center px-6 py-12 text-white", styles.container)}
      style={{ background: styles.background }}
    >
      {/* Decorative elements based on style */}
      {style === 'bold' && (
        <>
          <div 
            className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: settings.secondaryColor }}
          />
          <div 
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: 'white' }}
          />
        </>
      )}
      
      {style === 'dynamic' && (
        <>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-60 h-60 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-lg rotate-45" />
          </div>
        </>
      )}

      {style === 'elegant' && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </>
      )}

      {style === 'gradient' && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-30 blur-3xl"
            style={{ background: settings.secondaryColor }}
          />
        </div>
      )}
      
      <div className={cn("max-w-4xl mx-auto flex flex-col gap-6 relative z-10", getLayoutClasses())}>
        {content.badge && (
          <EditableText
            value={content.badge}
            onChange={(value) => onContentChange?.('badge', value)}
            isEditing={!!isEditing}
            as="span"
            className={cn(
              "inline-block px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm",
              style === 'elegant' ? 'border border-white/40 tracking-widest uppercase text-xs' : 'bg-white/20'
            )}
            placeholder="✨ شارة"
          />
        )}
        
        <EditableText
          value={content.headline || ''}
          onChange={(value) => onContentChange?.('headline', value)}
          isEditing={!!isEditing}
          as="h1"
          className={cn(styles.headline, "drop-shadow-lg leading-tight")}
          style={{ textAlign }}
          placeholder="أدخل العنوان الرئيسي..."
        />
        
        <EditableText
          value={content.subheadline || ''}
          onChange={(value) => onContentChange?.('subheadline', value)}
          isEditing={!!isEditing}
          as="p"
          className={cn(styles.subheadline, "max-w-2xl drop-shadow-md", layout === 'center' && 'mx-auto')}
          style={{ textAlign }}
          placeholder="أدخل الوصف الفرعي..."
          multiline
        />
        
        <div className={cn("mt-4", layout === 'center' && 'mx-auto')}>
          <EditableButton
            text={content.buttonText || 'ابدأ الآن'}
            url={content.buttonUrl}
            onTextChange={(value) => onContentChange?.('buttonText', value)}
            onUrlChange={(value) => onContentChange?.('buttonUrl', value)}
            isEditing={!!isEditing}
            className={cn(styles.button, "text-white border-0")}
            style={{ backgroundColor: settings.secondaryColor }}
          />
        </div>
      </div>
    </section>
  );
}
