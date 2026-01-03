import { useEffect, useState } from "react";

interface CountdownSectionProps {
  content: {
    endDate?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function CountdownSection({ content, settings, title }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const endDate = content.endDate ? new Date(content.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [content.endDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'يوم' },
    { value: timeLeft.hours, label: 'ساعة' },
    { value: timeLeft.minutes, label: 'دقيقة' },
    { value: timeLeft.seconds, label: 'ثانية' },
  ];

  return (
    <section 
      className="py-12 px-6"
      style={{ backgroundColor: `${settings.secondaryColor}15` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">⏰ {title || 'العرض ينتهي خلال'}</h2>
        <div className="flex justify-center gap-4">
          {timeUnits.map((unit, i) => (
            <div 
              key={i}
              className="bg-white rounded-xl p-4 min-w-[80px] shadow-lg"
            >
              <div 
                className="text-4xl font-bold"
                style={{ color: settings.primaryColor }}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500 mt-1">{unit.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
