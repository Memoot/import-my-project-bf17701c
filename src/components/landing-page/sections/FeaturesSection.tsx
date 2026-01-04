import { CheckCircle, TrendingUp, Award, Shield, Truck, RefreshCw, Zap, Smartphone, Target, Search, Share2, PenTool, Scissors, Sparkles, Heart, BookOpen, FileText, Video, Users, Mic, ChefHat, Leaf, Star, Camera, Package, User, Scale, Building2, FileCheck, Mic2, Home, Car, Trees, Waves, Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { Button } from "@/components/ui/button";

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

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onContentChange?.('items', newItems);
  };

  const addItem = () => {
    const newItems = [...items, { icon: 'CheckCircle', title: 'ميزة جديدة', description: 'وصف الميزة' }];
    onContentChange?.('items', newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onContentChange?.('items', newItems);
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <EditableText
          value={title || 'المميزات'}
          onChange={(value) => onContentChange?.('title', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold text-center mb-12"
          placeholder="أدخل العنوان..."
        />
        <div className={`grid gap-8 ${items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {items.map((item, i) => {
            const IconComponent = iconMap[item.icon || 'CheckCircle'] || CheckCircle;
            return (
              <div key={i} className="relative text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow group/item">
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(i);
                    }}
                    className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${settings.primaryColor}15` }}
                >
                  <IconComponent className="w-7 h-7" style={{ color: settings.primaryColor }} />
                </div>
                <EditableText
                  value={item.title}
                  onChange={(value) => updateItem(i, 'title', value)}
                  isEditing={!!isEditing}
                  as="h3"
                  className="font-semibold mb-2 text-lg"
                  placeholder="عنوان الميزة"
                />
                <EditableText
                  value={item.description || ''}
                  onChange={(value) => updateItem(i, 'description', value)}
                  isEditing={!!isEditing}
                  as="p"
                  className="text-gray-600 text-sm"
                  placeholder="وصف الميزة"
                />
              </div>
            );
          })}
        </div>
        {isEditing && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة ميزة
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
