import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  content: {
    items?: Array<{
      name: string;
      role?: string;
      text: string;
      avatar?: string;
      rating?: number;
    }>;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function TestimonialsSection({ content, settings, title }: TestimonialsSectionProps) {
  const items = content.items || [
    { name: 'أحمد محمد', role: 'مطور ويب', text: 'تجربة رائعة جداً', rating: 5 },
    { name: 'سارة علي', role: 'مصممة', text: 'أفضل استثمار قمت به', rating: 5 },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title || 'آراء العملاء'}</h2>
        <div className={`grid gap-6 ${items.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {item.rating && (
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`w-4 h-4 ${j < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-600 mb-4 italic">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
