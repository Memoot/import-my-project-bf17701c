import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface ContactSectionProps {
  content: {
    fields?: string[];
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

const fieldLabels: Record<string, string> = {
  name: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  phone: 'رقم الجوال',
  message: 'رسالتك',
  company: 'اسم الشركة',
  date: 'التاريخ المفضل',
  guests: 'عدد الضيوف',
  service: 'الخدمة المطلوبة',
  event_type: 'نوع المناسبة',
  case_type: 'نوع القضية',
  ticket_type: 'نوع التذكرة',
};

export function ContactSection({ content, settings, title }: ContactSectionProps) {
  const fields = content.fields || ['name', 'email', 'phone', 'message'];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{title || 'تواصل معنا'}</h2>
        <p className="text-center text-gray-600 mb-8">سنتواصل معك في أقرب وقت</p>
        
        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{fieldLabels[field] || field}</Label>
              {field === 'message' ? (
                <Textarea 
                  id={field}
                  placeholder={`أدخل ${fieldLabels[field] || field}...`}
                  rows={4}
                />
              ) : field === 'date' ? (
                <Input 
                  id={field}
                  type="date"
                />
              ) : (
                <Input 
                  id={field}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  placeholder={`أدخل ${fieldLabels[field] || field}...`}
                />
              )}
            </div>
          ))}
          
          <Button 
            type="submit"
            size="lg"
            className="w-full mt-6"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Send className="w-4 h-4 ml-2" />
            إرسال
          </Button>
        </form>
      </div>
    </section>
  );
}
