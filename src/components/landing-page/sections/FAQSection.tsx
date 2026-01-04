import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { Button } from "@/components/ui/button";

interface FAQSectionProps {
  content: {
    items?: Array<{
      question: string;
      answer: string;
    }>;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function FAQSection({ content, settings, title, isEditing, onContentChange }: FAQSectionProps) {
  const items = content.items || [
    { question: 'سؤال شائع 1؟', answer: 'الإجابة على السؤال الأول' },
    { question: 'سؤال شائع 2؟', answer: 'الإجابة على السؤال الثاني' },
    { question: 'سؤال شائع 3؟', answer: 'الإجابة على السؤال الثالث' },
  ];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onContentChange?.('items', newItems);
  };

  const addItem = () => {
    const newItems = [...items, { question: 'سؤال جديد؟', answer: 'الإجابة هنا' }];
    onContentChange?.('items', newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onContentChange?.('items', newItems);
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <EditableText
          value={title || 'الأسئلة الشائعة'}
          onChange={(value) => onContentChange?.('title', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold text-center mb-12"
          placeholder="أدخل العنوان..."
        />
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`}
              className="border rounded-xl px-6 bg-gray-50 relative group/faq"
            >
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(i);
                  }}
                  className="absolute top-2 left-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/faq:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <AccordionTrigger className="text-right font-semibold hover:no-underline">
                {isEditing ? (
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateItem(i, 'question', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent border-b border-dashed border-primary/30 focus:outline-none focus:border-primary"
                    placeholder="السؤال..."
                  />
                ) : (
                  item.question
                )}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {isEditing ? (
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateItem(i, 'answer', e.target.value)}
                    className="w-full bg-transparent border border-dashed border-primary/30 rounded p-2 focus:outline-none focus:border-primary resize-none min-h-[60px]"
                    placeholder="الإجابة..."
                  />
                ) : (
                  item.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {isEditing && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة سؤال
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
