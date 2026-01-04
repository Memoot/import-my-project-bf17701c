import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { EditableButton } from "../editor/EditableButton";

interface PricingSectionProps {
  content: {
    originalPrice?: string;
    salePrice?: string;
    currency?: string;
    buttonText?: string;
    buttonUrl?: string;
    features?: string[];
    plans?: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
    services?: Array<{
      name: string;
      price: string;
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

export function PricingSection({ content, settings, title, isEditing, onContentChange }: PricingSectionProps) {
  // If multiple plans exist
  if (content.plans && content.plans.length > 0) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <EditableText
            value={title || 'الباقات'}
            onChange={(value) => onContentChange?.('title', value)}
            isEditing={!!isEditing}
            as="h2"
            className="text-3xl font-bold text-center mb-12"
            placeholder="أدخل العنوان..."
          />
          <div className={`grid gap-6 ${content.plans.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
            {content.plans.map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white p-6 rounded-xl border-2 transition-transform hover:scale-105 ${
                  i === 1 ? 'border-2 shadow-xl' : 'border-gray-200'
                }`}
                style={{ borderColor: i === 1 ? settings.primaryColor : undefined }}
              >
                {i === 1 && (
                  <div 
                    className="text-white text-sm py-1 px-3 rounded-full inline-block mb-4"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    الأكثر طلباً
                  </div>
                )}
                <EditableText
                  value={plan.name}
                  onChange={(value) => {
                    const newPlans = [...content.plans!];
                    newPlans[i] = { ...newPlans[i], name: value };
                    onContentChange?.('plans', newPlans);
                  }}
                  isEditing={!!isEditing}
                  as="h3"
                  className="font-bold text-xl mb-2"
                  placeholder="اسم الباقة"
                />
                <div className="text-3xl font-bold mb-4" style={{ color: settings.primaryColor }}>
                  <EditableText
                    value={plan.price}
                    onChange={(value) => {
                      const newPlans = [...content.plans!];
                      newPlans[i] = { ...newPlans[i], price: value };
                      onContentChange?.('plans', newPlans);
                    }}
                    isEditing={!!isEditing}
                    as="span"
                    className="inline"
                    placeholder="السعر"
                  />
                  <span className="text-sm text-gray-500"> ر.س</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <EditableText
                        value={feature}
                        onChange={(value) => {
                          const newPlans = [...content.plans!];
                          const newFeatures = [...newPlans[i].features];
                          newFeatures[j] = value;
                          newPlans[i] = { ...newPlans[i], features: newFeatures };
                          onContentChange?.('plans', newPlans);
                        }}
                        isEditing={!!isEditing}
                        as="span"
                        className="flex-1"
                        placeholder="ميزة"
                      />
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  style={{ backgroundColor: i === 1 ? settings.primaryColor : undefined }}
                  variant={i === 1 ? 'default' : 'outline'}
                >
                  اختيار الباقة
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If services list
  if (content.services && content.services.length > 0) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <EditableText
            value={title || 'الأسعار'}
            onChange={(value) => onContentChange?.('title', value)}
            isEditing={!!isEditing}
            as="h2"
            className="text-3xl font-bold text-center mb-12"
            placeholder="أدخل العنوان..."
          />
          <div className="space-y-3">
            {content.services.map((service, i) => (
              <div key={i} className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                <EditableText
                  value={service.name}
                  onChange={(value) => {
                    const newServices = [...content.services!];
                    newServices[i] = { ...newServices[i], name: value };
                    onContentChange?.('services', newServices);
                  }}
                  isEditing={!!isEditing}
                  as="span"
                  className="font-medium"
                  placeholder="اسم الخدمة"
                />
                <span className="font-bold" style={{ color: settings.primaryColor }}>
                  <EditableText
                    value={service.price}
                    onChange={(value) => {
                      const newServices = [...content.services!];
                      newServices[i] = { ...newServices[i], price: value };
                      onContentChange?.('services', newServices);
                    }}
                    isEditing={!!isEditing}
                    as="span"
                    className="inline"
                    placeholder="السعر"
                  /> ر.س
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Single pricing
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(content.features || [])];
    newFeatures[index] = value;
    onContentChange?.('features', newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...(content.features || []), 'ميزة جديدة'];
    onContentChange?.('features', newFeatures);
  };

  const deleteFeature = (index: number) => {
    const newFeatures = (content.features || []).filter((_, i) => i !== index);
    onContentChange?.('features', newFeatures);
  };

  return (
    <section 
      className="py-16 px-6 text-white"
      style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}CC)` }}
    >
      <div className="max-w-xl mx-auto text-center">
        <EditableText
          value={title || 'احصل على العرض الآن'}
          onChange={(value) => onContentChange?.('title', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold mb-4"
          placeholder="أدخل العنوان..."
        />
        <EditableText
          value="عرض لفترة محدودة"
          onChange={() => {}}
          isEditing={false}
          as="p"
          className="mb-8 text-white/80"
        />
        <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl">
          <div className="mb-6">
            {content.originalPrice && (
              <span className="text-gray-400 line-through text-2xl">
                <EditableText
                  value={content.originalPrice}
                  onChange={(value) => onContentChange?.('originalPrice', value)}
                  isEditing={!!isEditing}
                  as="span"
                  className="inline"
                  placeholder="السعر الأصلي"
                /> {content.currency || 'ر.س'}
              </span>
            )}
            <div 
              className="text-5xl font-bold mt-2"
              style={{ color: settings.primaryColor }}
            >
              <EditableText
                value={content.salePrice || '297'}
                onChange={(value) => onContentChange?.('salePrice', value)}
                isEditing={!!isEditing}
                as="span"
                className="inline"
                placeholder="سعر البيع"
              /> {content.currency || 'ر.س'}
            </div>
          </div>
          {content.features && content.features.length > 0 && (
            <ul className="text-right space-y-3 mb-8">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 group/feat">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <EditableText
                    value={feature}
                    onChange={(value) => updateFeature(i, value)}
                    isEditing={!!isEditing}
                    as="span"
                    className="flex-1"
                    placeholder="ميزة"
                  />
                  {isEditing && (
                    <button
                      onClick={() => deleteFeature(i)}
                      className="p-1 text-red-500 opacity-0 group-hover/feat:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {isEditing && (
            <button
              onClick={addFeature}
              className="text-sm text-primary flex items-center gap-1 mb-4 mx-auto"
            >
              <Plus className="w-4 h-4" />
              إضافة ميزة
            </button>
          )}
          <EditableButton
            text={content.buttonText || 'اشترك الآن'}
            url={content.buttonUrl}
            onTextChange={(value) => onContentChange?.('buttonText', value)}
            onUrlChange={(value) => onContentChange?.('buttonUrl', value)}
            isEditing={!!isEditing}
            className="w-full text-lg py-6"
            style={{ backgroundColor: settings.primaryColor }}
          />
        </div>
      </div>
    </section>
  );
}
