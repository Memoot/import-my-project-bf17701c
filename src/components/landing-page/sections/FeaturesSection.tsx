import { CheckCircle, TrendingUp, Award, Shield, Truck, RefreshCw, Zap, Smartphone, Target, Search, Share2, PenTool, Scissors, Sparkles, Heart, BookOpen, FileText, Video, Users, Mic, ChefHat, Leaf, Star, Camera, Package, User, Scale, Building2, FileCheck, Mic2, Home, Car, Trees, Waves } from "lucide-react";

const iconMap: Record<string, any> = {
  CheckCircle, TrendingUp, Award, Shield, Truck, RefreshCw, Zap, Smartphone, Target, Search, Share2, PenTool, Scissors, Sparkles, Heart, BookOpen, FileText, Video, Users, Mic, ChefHat, Leaf, Star, Camera, Package, User, Scale, Building2, FileCheck, Mic2, Home, Car, Trees, Waves
};

interface FeaturesSectionProps {
  content: {
    items?: Array<{
      icon?: string;
      title: string;
      description?: string;
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

export function FeaturesSection({ content, settings, title, isEditing, onContentChange }: FeaturesSectionProps) {
  const items = content.items || [
    { icon: 'CheckCircle', title: 'ميزة 1', description: 'وصف الميزة الأولى' },
    { icon: 'TrendingUp', title: 'ميزة 2', description: 'وصف الميزة الثانية' },
    { icon: 'Award', title: 'ميزة 3', description: 'وصف الميزة الثالثة' },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title || 'المميزات'}</h2>
        <div className={`grid gap-8 ${items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {items.map((item, i) => {
            const IconComponent = iconMap[item.icon || 'CheckCircle'] || CheckCircle;
            return (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${settings.primaryColor}15` }}
                >
                  <IconComponent className="w-7 h-7" style={{ color: settings.primaryColor }} />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
