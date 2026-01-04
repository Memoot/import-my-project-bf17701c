import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { EditableButton } from "../editor/EditableButton";

interface CTASectionProps {
  content: {
    headline?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function CTASection({ content, settings, title, isEditing, onContentChange }: CTASectionProps) {
  return (
    <section 
      className="py-16 px-6"
      style={{ backgroundColor: `${settings.primaryColor}08` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <EditableText
          value={content.headline || title || 'جاهز للبدء؟'}
          onChange={(value) => onContentChange?.('headline', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold mb-4"
          placeholder="أدخل العنوان..."
        />
        
        <EditableText
          value={content.description || 'انضم لآلاف العملاء الراضين'}
          onChange={(value) => onContentChange?.('description', value)}
          isEditing={!!isEditing}
          as="p"
          className="text-gray-600 mb-8"
          placeholder="أدخل الوصف..."
        />
        
        <EditableButton
          text={content.buttonText || 'ابدأ الآن'}
          url={content.buttonUrl}
          onTextChange={(value) => onContentChange?.('buttonText', value)}
          onUrlChange={(value) => onContentChange?.('buttonUrl', value)}
          isEditing={!!isEditing}
          className="text-lg px-8 py-6 group"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {content.buttonText || 'ابدأ الآن'}
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        </EditableButton>
      </div>
    </section>
  );
}
