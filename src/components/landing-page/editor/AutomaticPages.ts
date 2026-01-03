import { LandingPage } from "@/data/landingPageTemplates";

// إنشاء صفحات تلقائية
export function createAutomaticPage(
  type: 'thankyou' | 'checkout' | 'privacy',
  settings: LandingPage['settings']
): LandingPage {
  const baseSettings = { ...settings };

  switch (type) {
    case 'thankyou':
      return {
        id: `page-thankyou-${Date.now()}`,
        name: 'صفحة الشكر',
        type: 'thankyou',
        settings: baseSettings,
        sections: [
          {
            id: `section-thankyou-hero-${Date.now()}`,
            type: 'hero',
            title: 'رسالة الشكر',
            order: 1,
            content: {
              headline: '🎉 شكراً لك!',
              subheadline: 'تم استلام طلبك بنجاح. سنتواصل معك قريباً.',
              buttonText: 'العودة للصفحة الرئيسية',
              buttonUrl: '/',
              style: 'elegant',
              layout: 'center',
              badge: 'تم بنجاح',
            },
          },
          {
            id: `section-thankyou-info-${Date.now()}`,
            type: 'features',
            title: 'الخطوات التالية',
            order: 2,
            content: {
              items: [
                {
                  icon: 'Mail',
                  title: 'تحقق من بريدك',
                  description: 'ستصلك رسالة تأكيد خلال دقائق',
                },
                {
                  icon: 'Clock',
                  title: 'انتظر التواصل',
                  description: 'فريقنا سيتواصل معك خلال 24 ساعة',
                },
                {
                  icon: 'CheckCircle',
                  title: 'استمتع بالخدمة',
                  description: 'نحن سعداء بخدمتك!',
                },
              ],
            },
          },
        ],
      };

    case 'checkout':
      return {
        id: `page-checkout-${Date.now()}`,
        name: 'صفحة الدفع',
        type: 'checkout' as any,
        settings: baseSettings,
        sections: [
          {
            id: `section-checkout-hero-${Date.now()}`,
            type: 'hero',
            title: 'إتمام الطلب',
            order: 1,
            content: {
              headline: 'إتمام عملية الشراء',
              subheadline: 'أنت على بعد خطوة واحدة من الحصول على منتجك',
              style: 'minimal',
              layout: 'center',
            },
          },
          {
            id: `section-checkout-form-${Date.now()}`,
            type: 'contact',
            title: 'بيانات الدفع',
            order: 2,
            content: {
              fields: ['name', 'email', 'phone'],
              showPaymentFields: true,
            },
          },
          {
            id: `section-checkout-summary-${Date.now()}`,
            type: 'pricing',
            title: 'ملخص الطلب',
            order: 3,
            content: {
              originalPrice: '0',
              salePrice: '0',
              currency: 'ر.س',
              buttonText: 'إتمام الدفع',
              features: ['ضمان استرداد المال', 'دعم فني على مدار الساعة'],
            },
          },
        ],
      };

    case 'privacy':
      return {
        id: `page-privacy-${Date.now()}`,
        name: 'سياسة الخصوصية',
        type: 'custom',
        settings: baseSettings,
        sections: [
          {
            id: `section-privacy-hero-${Date.now()}`,
            type: 'hero',
            title: 'سياسة الخصوصية',
            order: 1,
            content: {
              headline: 'سياسة الخصوصية',
              subheadline: 'نحن نهتم بحماية خصوصيتك وبياناتك الشخصية',
              style: 'minimal',
              layout: 'center',
            },
          },
          {
            id: `section-privacy-content-${Date.now()}`,
            type: 'about',
            title: 'محتوى السياسة',
            order: 2,
            content: {
              name: 'سياسة الخصوصية',
              bio: `
# جمع المعلومات
نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو إجراء عملية شراء.

# استخدام المعلومات
نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، والتواصل معك.

# مشاركة المعلومات
لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.

# حماية المعلومات
نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به.

# حقوقك
لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها.

# الاتصال بنا
إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا.
              `,
              achievements: [],
            },
          },
        ],
      };

    default:
      return {
        id: `page-custom-${Date.now()}`,
        name: 'صفحة جديدة',
        type: 'custom',
        settings: baseSettings,
        sections: [],
      };
  }
}

// الحصول على قائمة الصفحات التلقائية المتاحة
export const AUTOMATIC_PAGES = [
  {
    type: 'thankyou' as const,
    label: 'صفحة الشكر',
    description: 'تظهر للمستخدم بعد إتمام عملية الشراء أو التسجيل',
    icon: 'Heart',
  },
  {
    type: 'checkout' as const,
    label: 'صفحة الدفع',
    description: 'صفحة لإتمام عملية الشراء وجمع بيانات الدفع',
    icon: 'CreditCard',
  },
  {
    type: 'privacy' as const,
    label: 'سياسة الخصوصية',
    description: 'صفحة قانونية توضح كيفية التعامل مع بيانات المستخدمين',
    icon: 'Shield',
  },
];
