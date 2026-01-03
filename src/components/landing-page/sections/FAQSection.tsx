import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
}

export function FAQSection({ content, settings, title }: FAQSectionProps) {
  const items = content.items || [
    { question: 'سؤال شائع 1؟', answer: 'الإجابة على السؤال الأول' },
    { question: 'سؤال شائع 2؟', answer: 'الإجابة على السؤال الثاني' },
    { question: 'سؤال شائع 3؟', answer: 'الإجابة على السؤال الثالث' },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title || 'الأسئلة الشائعة'}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`}
              className="border rounded-xl px-6 bg-gray-50"
            >
              <AccordionTrigger className="text-right font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
