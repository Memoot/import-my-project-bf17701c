import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingSectionProps {
  content: {
    originalPrice?: string;
    salePrice?: string;
    currency?: string;
    buttonText?: string;
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
}

export function PricingSection({ content, settings, title }: PricingSectionProps) {
  // If multiple plans exist
  if (content.plans && content.plans.length > 0) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{title || 'الباقات'}</h2>
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
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4" style={{ color: settings.primaryColor }}>
                  {plan.price} <span className="text-sm text-gray-500">ر.س</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
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
          <h2 className="text-3xl font-bold text-center mb-12">{title || 'الأسعار'}</h2>
          <div className="space-y-3">
            {content.services.map((service, i) => (
              <div key={i} className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                <span className="font-medium">{service.name}</span>
                <span className="font-bold" style={{ color: settings.primaryColor }}>
                  {service.price} ر.س
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Single pricing
  return (
    <section 
      className="py-16 px-6 text-white"
      style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}CC)` }}
    >
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{title || 'احصل على العرض الآن'}</h2>
        <p className="mb-8 text-white/80">عرض لفترة محدودة</p>
        <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl">
          <div className="mb-6">
            {content.originalPrice && (
              <span className="text-gray-400 line-through text-2xl">
                {content.originalPrice} {content.currency || 'ر.س'}
              </span>
            )}
            <div 
              className="text-5xl font-bold mt-2"
              style={{ color: settings.primaryColor }}
            >
              {content.salePrice || '297'} {content.currency || 'ر.س'}
            </div>
          </div>
          {content.features && content.features.length > 0 && (
            <ul className="text-right space-y-3 mb-8">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <Button 
            size="lg" 
            className="w-full text-lg py-6"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {content.buttonText || 'اشترك الآن'}
          </Button>
        </div>
      </div>
    </section>
  );
}
