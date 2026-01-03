import { Gift } from "lucide-react";

interface BonusSectionProps {
  content: {
    items?: Array<{
      title: string;
      value: string;
    }>;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function BonusSection({ content, settings, title }: BonusSectionProps) {
  const items = content.items || [
    { title: 'هدية 1', value: '97$' },
    { title: 'هدية 2', value: '197$' },
    { title: 'هدية 3', value: '297$' },
  ];

  return (
    <section 
      className="py-16 px-6"
      style={{ backgroundColor: `${settings.secondaryColor}10` }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">🎁 {title || 'هدايا مجانية'}</h2>
        <p className="text-center text-gray-600 mb-12">احصل على هذه الهدايا عند التسجيل اليوم</p>
        <div className={`grid gap-6 ${items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {items.map((item, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-xl border-2 text-center hover:shadow-lg transition-all"
              style={{ borderColor: `${settings.secondaryColor}40` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${settings.secondaryColor}20` }}
              >
                <Gift className="w-8 h-8" style={{ color: settings.secondaryColor }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="font-bold text-lg" style={{ color: settings.secondaryColor }}>
                قيمتها {item.value}
              </p>
              <p className="text-green-600 text-sm mt-2 font-medium">مجاناً معك!</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
