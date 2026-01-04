import { Star, Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { Button } from "@/components/ui/button";

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
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function TestimonialsSection({ content, settings, title, isEditing, onContentChange }: TestimonialsSectionProps) {
  const items = content.items || [
    { name: 'أحمد محمد', role: 'مطور ويب', text: 'تجربة رائعة جداً', rating: 5 },
    { name: 'سارة علي', role: 'مصممة', text: 'أفضل استثمار قمت به', rating: 5 },
  ];

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onContentChange?.('items', newItems);
  };

  const addItem = () => {
    const newItems = [...items, { name: 'اسم العميل', role: 'الوظيفة', text: 'رأي العميل هنا', rating: 5 }];
    onContentChange?.('items', newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onContentChange?.('items', newItems);
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <EditableText
          value={title || 'آراء العملاء'}
          onChange={(value) => onContentChange?.('title', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold text-center mb-12"
          placeholder="أدخل العنوان..."
        />
        <div className={`grid gap-6 ${items.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {items.map((item, i) => (
            <div key={i} className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group/item">
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
              {item.rating && (
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`w-4 h-4 cursor-pointer ${j < item.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => isEditing && updateItem(i, 'rating', j + 1)}
                    />
                  ))}
                </div>
              )}
              <EditableText
                value={item.text}
                onChange={(value) => updateItem(i, 'text', value)}
                isEditing={!!isEditing}
                as="p"
                className="text-gray-600 mb-4 italic"
                placeholder="رأي العميل..."
                multiline
              />
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <EditableText
                    value={item.name}
                    onChange={(value) => updateItem(i, 'name', value)}
                    isEditing={!!isEditing}
                    as="p"
                    className="font-semibold"
                    placeholder="اسم العميل"
                  />
                  <EditableText
                    value={item.role || ''}
                    onChange={(value) => updateItem(i, 'role', value)}
                    isEditing={!!isEditing}
                    as="p"
                    className="text-sm text-gray-500"
                    placeholder="الوظيفة"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة رأي
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
