import { Award, Users, Clock } from "lucide-react";

interface AboutSectionProps {
  content: {
    name?: string;
    bio?: string;
    achievements?: string[];
    image?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function AboutSection({ content, settings, title }: AboutSectionProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title || 'من نحن'}</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div 
            className="w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {(content.name || 'اسم').charAt(0)}
          </div>
          <div className="text-center md:text-right flex-1">
            <h3 className="text-2xl font-bold mb-2">{content.name || 'اسم المؤسس'}</h3>
            <p className="text-gray-600 mb-6">{content.bio || 'وصف مختصر عن الشخص أو المؤسسة'}</p>
            {content.achievements && content.achievements.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {content.achievements.map((achievement, i) => (
                  <div 
                    key={i} 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${settings.primaryColor}15`,
                      color: settings.primaryColor
                    }}
                  >
                    ✓ {achievement}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
