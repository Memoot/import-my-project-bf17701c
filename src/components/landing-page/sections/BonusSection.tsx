import { Gift, Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { Button } from "@/components/ui/button";

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
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function BonusSection({ content, settings, title, isEditing, onContentChange }: BonusSectionProps) {
  const items = content.items || [
    { title: 'هدية 1', value: '97$' },
    { title: 'هدية 2', value: '197$' },
    { title: 'هدية 3', value: '297$' },
  ];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onContentChange?.('items', newItems);
  };

  const addItem = () => {
    const newItems = [...items, { title: 'هدية جديدة', value: '99$' }];
    onContentChange?.('items', newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onContentChange?.('items', newItems);
  };

  return (
    <section 
      className="py-16 px-6"
      style={{ backgroundColor: `${settings.secondaryColor}10` }}
    >
      <div className="max-w-4xl mx-auto">
        <EditableText
          value={`🎁 ${title || 'هدايا مجانية'}`}
          onChange={(value) => onContentChange?.('title', value.replace('🎁 ', ''))}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold text-center mb-4"
          placeholder="أدخل العنوان..."
        />
        <EditableText
          value="احصل على هذه الهدايا عند التسجيل اليوم"
          onChange={() => {}}
          isEditing={false}
          as="p"
          className="text-center text-gray-600 mb-12"
        />
        <div className={`grid gap-6 ${items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {items.map((item, i) => (
            <div 
              key={i} 
              className="relative bg-white p-6 rounded-xl border-2 text-center hover:shadow-lg transition-all group/bonus"
              style={{ borderColor: `${settings.secondaryColor}40` }}
            >
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(i);
                  }}
                  className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/bonus:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${settings.secondaryColor}20` }}
              >
                <Gift className="w-8 h-8" style={{ color: settings.secondaryColor }} />
              </div>
              <EditableText
                value={item.title}
                onChange={(value) => updateItem(i, 'title', value)}
                isEditing={!!isEditing}
                as="h3"
                className="font-semibold text-lg mb-2"
                placeholder="عنوان الهدية"
              />
              <p className="font-bold text-lg" style={{ color: settings.secondaryColor }}>
                قيمتها{' '}
                <EditableText
                  value={item.value}
                  onChange={(value) => updateItem(i, 'value', value)}
                  isEditing={!!isEditing}
                  as="span"
                  className="inline"
                  placeholder="القيمة"
                />
              </p>
              <p className="text-green-600 text-sm mt-2 font-medium">مجاناً معك!</p>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة هدية
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
