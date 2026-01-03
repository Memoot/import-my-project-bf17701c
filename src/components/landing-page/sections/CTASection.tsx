import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CTASectionProps {
  content: {
    headline?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function CTASection({ content, settings, title }: CTASectionProps) {
  return (
    <section 
      className="py-16 px-6"
      style={{ backgroundColor: `${settings.primaryColor}08` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          {content.headline || title || 'جاهز للبدء؟'}
        </h2>
        <p className="text-gray-600 mb-8">انضم لآلاف العملاء الراضين</p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 group"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {content.buttonText || 'ابدأ الآن'}
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}
