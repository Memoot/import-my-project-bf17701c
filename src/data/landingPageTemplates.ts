export interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'cta' | 'bonus' | 'about' | 'gallery' | 'contact' | 'countdown' | 'video' | 'blog';
  title: string;
  content: Record<string, any>;
  order: number;
}

export interface LandingPage {
  id: string;
  name: string;
  type: 'sales' | 'thankyou' | 'optin' | 'webinar' | 'custom';
  sections: LandingPageSection[];
  settings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    direction: 'rtl' | 'ltr';
  };
}

export interface LandingPageTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  previewImage?: string;
  pages: LandingPage[];
  isPopular: boolean;
  uses: number;
}

// Template preview images - using imports for proper bundling
import templateCourse from '@/assets/templates/template-course.png';
import templateEcommerce from '@/assets/templates/template-ecommerce.png';
import templateConsulting from '@/assets/templates/template-consulting.png';
import templateApp from '@/assets/templates/template-app.png';
import templateFitness from '@/assets/templates/template-fitness.png';
import templateRealestate from '@/assets/templates/template-realestate.png';
import templateRestaurant from '@/assets/templates/template-restaurant.png';
import templateWebinar from '@/assets/templates/template-webinar.png';
import templateServices from '@/assets/templates/template-services.png';
import templateCoaching from '@/assets/templates/template-coaching.png';

export const templatePreviewImages: Record<string, string> = {
  course: templateCourse,
  ecommerce: templateEcommerce,
  consulting: templateConsulting,
  app: templateApp,
  fitness: templateFitness,
  realestate: templateRealestate,
  restaurant: templateRestaurant,
  webinar: templateWebinar,
  services: templateServices,
  coaching: templateCoaching,
};

export const landingPageCategories = [
  "الكل",
  "التجارة الإلكترونية",
  "الدورات التدريبية",
  "الخدمات",
  "التطبيقات",
  "الاستشارات",
  "الصحة واللياقة",
  "العقارات",
  "المطاعم",
];

export const sectionTypes = [
  { type: 'hero', label: 'القسم الرئيسي (Hero)', icon: 'Layout' },
  { type: 'features', label: 'المميزات', icon: 'Star' },
  { type: 'testimonials', label: 'آراء العملاء', icon: 'MessageSquare' },
  { type: 'pricing', label: 'الأسعار', icon: 'DollarSign' },
  { type: 'faq', label: 'الأسئلة الشائعة', icon: 'HelpCircle' },
  { type: 'cta', label: 'دعوة للإجراء', icon: 'MousePointer' },
  { type: 'bonus', label: 'الهدايا والمكافآت', icon: 'Gift' },
  { type: 'about', label: 'من نحن', icon: 'Users' },
  { type: 'gallery', label: 'معرض الصور', icon: 'Image' },
  { type: 'contact', label: 'تواصل معنا', icon: 'Mail' },
  { type: 'countdown', label: 'العد التنازلي', icon: 'Clock' },
  { type: 'video', label: 'فيديو', icon: 'Play' },
  { type: 'blog', label: 'المدونة', icon: 'BookOpen' },
];

export const landingPageTemplates: LandingPageTemplate[] = [
  {
    id: 1,
    name: "قالب الدورة التدريبية",
    category: "الدورات التدريبية",
    description: "قالب احترافي لبيع الدورات التدريبية مع صفحة بيع وشكر",
    thumbnail: "course",
    isPopular: true,
    uses: 1250,
    pages: [
      {
        id: "sales-1",
        name: "صفحة البيع",
        type: "sales",
        settings: {
          primaryColor: "#1e40af",
          secondaryColor: "#f97316",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-1",
            type: "hero",
            title: "القسم الرئيسي",
            order: 1,
            content: {
              headline: "تعلم مهارة جديدة واحترفها في 30 يوماً",
              subheadline: "دورة تدريبية شاملة ستغير مسارك المهني",
              buttonText: "سجل الآن",
              buttonUrl: "#pricing",
              backgroundType: "gradient",
              style: "bold",
              layout: "center",
              badge: "الأكثر مبيعاً"
            }
          },
          {
            id: "features-1",
            type: "features",
            title: "ماذا ستتعلم؟",
            order: 2,
            content: {
              items: [
                { icon: "CheckCircle", title: "أساسيات متينة", description: "تعلم الأساسيات بشكل صحيح من البداية" },
                { icon: "TrendingUp", title: "تطبيقات عملية", description: "مشاريع حقيقية لتطبيق ما تعلمته" },
                { icon: "Award", title: "شهادة معتمدة", description: "احصل على شهادة بعد إتمام الدورة" },
              ]
            }
          },
          {
            id: "bonus-1",
            type: "bonus",
            title: "هدايا مجانية",
            order: 3,
            content: {
              items: [
                { title: "كتاب إلكتروني", value: "97$" },
                { title: "قوالب جاهزة", value: "197$" },
                { title: "جلسة استشارية", value: "297$" },
              ]
            }
          },
          {
            id: "testimonials-1",
            type: "testimonials",
            title: "ماذا يقول طلابنا؟",
            order: 4,
            content: {
              items: [
                { name: "أحمد محمد", role: "مطور ويب", text: "دورة رائعة غيرت مساري المهني", avatar: "" },
                { name: "سارة علي", role: "مصممة", text: "أفضل استثمار قمت به", avatar: "" },
              ]
            }
          },
          {
            id: "pricing-1",
            type: "pricing",
            title: "احصل على الدورة الآن",
            order: 5,
            content: {
              originalPrice: "997",
              salePrice: "297",
              currency: "ر.س",
              buttonText: "اشترك الآن",
              features: ["وصول مدى الحياة", "دعم فني", "تحديثات مجانية"]
            }
          },
          {
            id: "faq-1",
            type: "faq",
            title: "الأسئلة الشائعة",
            order: 6,
            content: {
              items: [
                { question: "هل الدورة مناسبة للمبتدئين؟", answer: "نعم، الدورة مصممة للمبتدئين والمتقدمين" },
                { question: "كم مدة الوصول للدورة؟", answer: "وصول مدى الحياة" },
                { question: "هل يوجد ضمان استرداد؟", answer: "نعم، ضمان 30 يوم" },
              ]
            }
          }
        ]
      },
      {
        id: "thankyou-1",
        name: "صفحة الشكر",
        type: "thankyou",
        settings: {
          primaryColor: "#1e40af",
          secondaryColor: "#f97316",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty",
            type: "hero",
            title: "شكراً لك!",
            order: 1,
            content: {
              headline: "🎉 تهانينا! تم تسجيلك بنجاح",
              subheadline: "تحقق من بريدك الإلكتروني للحصول على تفاصيل الدخول",
              buttonText: "ابدأ التعلم الآن",
              buttonUrl: "/course"
            }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "قالب المتجر الإلكتروني",
    category: "التجارة الإلكترونية",
    description: "قالب لعرض منتجاتك بشكل احترافي",
    thumbnail: "ecommerce",
    isPopular: true,
    uses: 980,
    pages: [
      {
        id: "sales-2",
        name: "صفحة المنتج",
        type: "sales",
        settings: {
          primaryColor: "#059669",
          secondaryColor: "#d97706",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-2",
            type: "hero",
            title: "المنتج",
            order: 1,
            content: {
              headline: "المنتج الأكثر مبيعاً في السوق",
              subheadline: "اكتشف لماذا يحبه الجميع",
              buttonText: "اطلب الآن",
              buttonUrl: "#order",
              backgroundType: "gradient",
              style: "dynamic",
              layout: "center",
              badge: "عرض خاص"
            }
          },
          {
            id: "features-2",
            type: "features",
            title: "مميزات المنتج",
            order: 2,
            content: {
              items: [
                { icon: "Shield", title: "جودة عالية", description: "مصنوع من أفضل المواد" },
                { icon: "Truck", title: "شحن سريع", description: "توصيل خلال 3 أيام" },
                { icon: "RefreshCw", title: "استرجاع مجاني", description: "30 يوم ضمان" },
              ]
            }
          },
          {
            id: "gallery-2",
            type: "gallery",
            title: "صور المنتج",
            order: 3,
            content: {
              images: []
            }
          },
          {
            id: "testimonials-2",
            type: "testimonials",
            title: "آراء العملاء",
            order: 4,
            content: {
              items: [
                { name: "خالد", text: "منتج ممتاز وجودة عالية", rating: 5 },
                { name: "نورة", text: "سرعة في التوصيل", rating: 5 },
              ]
            }
          },
          {
            id: "pricing-2",
            type: "pricing",
            title: "اطلب الآن",
            order: 5,
            content: {
              originalPrice: "299",
              salePrice: "199",
              currency: "ر.س",
              buttonText: "أضف للسلة"
            }
          }
        ]
      },
      {
        id: "thankyou-2",
        name: "صفحة الشكر",
        type: "thankyou",
        settings: {
          primaryColor: "#059669",
          secondaryColor: "#d97706",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty2",
            type: "hero",
            title: "شكراً لطلبك!",
            order: 1,
            content: {
              headline: "✅ تم استلام طلبك بنجاح",
              subheadline: "رقم الطلب: #12345 - سنتواصل معك قريباً"
            }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "قالب الخدمات الاستشارية",
    category: "الاستشارات",
    description: "قالب لعرض خدماتك الاستشارية",
    thumbnail: "consulting",
    isPopular: false,
    uses: 650,
    pages: [
      {
        id: "sales-3",
        name: "صفحة الخدمة",
        type: "sales",
        settings: {
          primaryColor: "#7c3aed",
          secondaryColor: "#ec4899",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-3",
            type: "hero",
            title: "القسم الرئيسي",
            order: 1,
            content: {
              headline: "استشارات احترافية لتنمية أعمالك",
              subheadline: "خبرة 10+ سنوات في مجال الأعمال",
              buttonText: "احجز استشارتك",
              buttonUrl: "#booking",
              backgroundType: "gradient",
              style: "elegant",
              layout: "center",
              badge: "استشارة مجانية"
            }
          },
          {
            id: "about-3",
            type: "about",
            title: "من أنا",
            order: 2,
            content: {
              name: "اسم المستشار",
              bio: "خبير في مجال الأعمال والتسويق",
              achievements: ["100+ عميل راضي", "10 سنوات خبرة"]
            }
          },
          {
            id: "features-3",
            type: "features",
            title: "خدماتي",
            order: 3,
            content: {
              items: [
                { title: "استشارة فردية", description: "جلسة مكثفة لمناقشة تحدياتك" },
                { title: "خطة عمل", description: "إعداد خطة عمل متكاملة" },
                { title: "متابعة شهرية", description: "متابعة مستمرة لتحقيق أهدافك" },
              ]
            }
          },
          {
            id: "cta-3",
            type: "cta",
            title: "ابدأ الآن",
            order: 4,
            content: {
              headline: "جاهز لتنمية أعمالك؟",
              buttonText: "احجز موعدك",
              buttonUrl: "#contact"
            }
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "قالب التطبيقات",
    category: "التطبيقات",
    description: "قالب لعرض تطبيقك بشكل جذاب",
    thumbnail: "app",
    isPopular: true,
    uses: 820,
    pages: [
      {
        id: "sales-4",
        name: "صفحة التطبيق",
        type: "sales",
        settings: {
          primaryColor: "#0ea5e9",
          secondaryColor: "#8b5cf6",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-4",
            type: "hero",
            title: "التطبيق",
            order: 1,
            content: {
              headline: "تطبيق يغير طريقة عملك",
              subheadline: "حمّل الآن مجاناً",
              buttonText: "حمّل من App Store",
              buttonUrl: "#download",
              backgroundType: "gradient",
              style: "gradient",
              layout: "center",
              badge: "جديد"
            }
          },
          {
            id: "features-4",
            type: "features",
            title: "مميزات التطبيق",
            order: 2,
            content: {
              items: [
                { icon: "Zap", title: "سريع وخفيف" },
                { icon: "Shield", title: "آمن ومحمي" },
                { icon: "Smartphone", title: "تصميم عصري" },
              ]
            }
          },
          {
            id: "video-4",
            type: "video",
            title: "شاهد التطبيق",
            order: 3,
            content: {
              videoUrl: "",
              thumbnail: ""
            }
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "قالب الصحة واللياقة",
    category: "الصحة واللياقة",
    description: "قالب لبرامج اللياقة والتغذية",
    thumbnail: "fitness",
    isPopular: false,
    uses: 540,
    pages: [
      {
        id: "sales-5",
        name: "صفحة البرنامج",
        type: "sales",
        settings: {
          primaryColor: "#dc2626",
          secondaryColor: "#f59e0b",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-5",
            type: "hero",
            title: "البرنامج",
            order: 1,
            content: {
              headline: "حوّل جسمك في 90 يوماً",
              subheadline: "برنامج تدريبي وغذائي متكامل",
              buttonText: "ابدأ رحلتك",
              buttonUrl: "#join",
              backgroundType: "gradient",
              style: "dynamic",
              layout: "center",
              badge: "برنامج مكثف"
            }
          },
          {
            id: "countdown-5",
            type: "countdown",
            title: "العرض ينتهي خلال",
            order: 2,
            content: {
              endDate: "2024-12-31"
            }
          },
          {
            id: "features-5",
            type: "features",
            title: "ماذا يتضمن البرنامج؟",
            order: 3,
            content: {
              items: [
                { title: "خطة تمارين", description: "تمارين يومية مصممة لك" },
                { title: "خطة غذائية", description: "وصفات صحية ولذيذة" },
                { title: "متابعة أسبوعية", description: "تواصل مباشر مع المدرب" },
              ]
            }
          },
          {
            id: "bonus-5",
            type: "bonus",
            title: "هدايا حصرية",
            order: 4,
            content: {
              items: [
                { title: "كتاب الوصفات", value: "مجاني" },
                { title: "تطبيق التتبع", value: "مجاني" },
              ]
            }
          }
        ]
      },
      {
        id: "thankyou-5",
        name: "صفحة الشكر",
        type: "thankyou",
        settings: {
          primaryColor: "#dc2626",
          secondaryColor: "#f59e0b",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty5",
            type: "hero",
            title: "مبروك!",
            order: 1,
            content: {
              headline: "🏋️ أهلاً بك في البرنامج!",
              subheadline: "رحلتك نحو جسم صحي تبدأ الآن"
            }
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "قالب الندوات الإلكترونية",
    category: "الدورات التدريبية",
    description: "قالب للتسجيل في الويبينار",
    thumbnail: "webinar",
    isPopular: false,
    uses: 430,
    pages: [
      {
        id: "optin-6",
        name: "صفحة التسجيل",
        type: "optin",
        settings: {
          primaryColor: "#1e40af",
          secondaryColor: "#10b981",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-6",
            type: "hero",
            title: "الويبينار",
            order: 1,
            content: {
              headline: "ويبينار مجاني: أسرار النجاح",
              subheadline: "سجل الآن واحجز مقعدك",
              buttonText: "سجل مجاناً"
            }
          },
          {
            id: "countdown-6",
            type: "countdown",
            title: "يبدأ خلال",
            order: 2,
            content: {
              endDate: "2024-12-20T19:00:00"
            }
          },
          {
            id: "features-6",
            type: "features",
            title: "ماذا ستتعلم؟",
            order: 3,
            content: {
              items: [
                { title: "استراتيجيات مثبتة" },
                { title: "أدوات عملية" },
                { title: "أسئلة وأجوبة مباشرة" },
              ]
            }
          },
          {
            id: "contact-6",
            type: "contact",
            title: "سجل الآن",
            order: 4,
            content: {
              fields: ["name", "email", "phone"]
            }
          }
        ]
      },
      {
        id: "thankyou-6",
        name: "صفحة التأكيد",
        type: "thankyou",
        settings: {
          primaryColor: "#1e40af",
          secondaryColor: "#10b981",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty6",
            type: "hero",
            title: "تم التسجيل!",
            order: 1,
            content: {
              headline: "✅ تم تأكيد تسجيلك",
              subheadline: "سنرسل لك رابط الويبينار على بريدك"
            }
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "قالب العقارات الفاخرة",
    category: "العقارات",
    description: "قالب احترافي لعرض العقارات والمشاريع السكنية",
    thumbnail: "realestate",
    isPopular: true,
    uses: 780,
    pages: [
      {
        id: "sales-7",
        name: "صفحة العقار",
        type: "sales",
        settings: {
          primaryColor: "#0f172a",
          secondaryColor: "#ca8a04",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-7",
            type: "hero",
            title: "العقار",
            order: 1,
            content: {
              headline: "فيلا فاخرة في قلب المدينة",
              subheadline: "استثمر في منزل أحلامك",
              buttonText: "احجز جولة",
              buttonUrl: "#booking",
              backgroundType: "image"
            }
          },
          {
            id: "gallery-7",
            type: "gallery",
            title: "معرض الصور",
            order: 2,
            content: {
              images: []
            }
          },
          {
            id: "features-7",
            type: "features",
            title: "مميزات العقار",
            order: 3,
            content: {
              items: [
                { icon: "Home", title: "5 غرف نوم", description: "غرف واسعة ومريحة" },
                { icon: "Car", title: "موقف سيارات", description: "يتسع لـ 3 سيارات" },
                { icon: "Trees", title: "حديقة خاصة", description: "مساحة خضراء كبيرة" },
                { icon: "Waves", title: "مسبح خاص", description: "مسبح مدفأ على مدار العام" }
              ]
            }
          },
          {
            id: "video-7",
            type: "video",
            title: "جولة افتراضية",
            order: 4,
            content: {
              videoUrl: "",
              thumbnail: ""
            }
          },
          {
            id: "contact-7",
            type: "contact",
            title: "تواصل معنا",
            order: 5,
            content: {
              fields: ["name", "email", "phone", "message"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: "قالب المطعم الفاخر",
    category: "المطاعم",
    description: "قالب أنيق للمطاعم والكافيهات",
    thumbnail: "restaurant",
    isPopular: true,
    uses: 920,
    pages: [
      {
        id: "sales-8",
        name: "صفحة المطعم",
        type: "sales",
        settings: {
          primaryColor: "#7c2d12",
          secondaryColor: "#fbbf24",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-8",
            type: "hero",
            title: "المطعم",
            order: 1,
            content: {
              headline: "تجربة طعام استثنائية",
              subheadline: "أطباق شرقية وغربية بلمسة عصرية",
              buttonText: "احجز طاولتك",
              buttonUrl: "#reserve",
              backgroundType: "image"
            }
          },
          {
            id: "features-8",
            type: "features",
            title: "لماذا نحن؟",
            order: 2,
            content: {
              items: [
                { icon: "ChefHat", title: "طهاة محترفون", description: "فريق من أفضل الطهاة" },
                { icon: "Leaf", title: "مكونات طازجة", description: "نستخدم أفضل المكونات" },
                { icon: "Star", title: "تقييم 5 نجوم", description: "أعلى التقييمات من عملائنا" }
              ]
            }
          },
          {
            id: "gallery-8",
            type: "gallery",
            title: "أطباقنا المميزة",
            order: 3,
            content: {
              images: []
            }
          },
          {
            id: "testimonials-8",
            type: "testimonials",
            title: "آراء زوارنا",
            order: 4,
            content: {
              items: [
                { name: "محمد", text: "أفضل مطعم زرته", rating: 5 },
                { name: "فاطمة", text: "طعام لذيذ وخدمة ممتازة", rating: 5 }
              ]
            }
          },
          {
            id: "contact-8",
            type: "contact",
            title: "احجز طاولتك",
            order: 5,
            content: {
              fields: ["name", "phone", "date", "guests"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 9,
    name: "قالب وكالة التسويق",
    category: "الخدمات",
    description: "قالب عصري لوكالات التسويق الرقمي",
    thumbnail: "marketing",
    isPopular: true,
    uses: 1100,
    pages: [
      {
        id: "sales-9",
        name: "صفحة الخدمات",
        type: "sales",
        settings: {
          primaryColor: "#4f46e5",
          secondaryColor: "#06b6d4",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-9",
            type: "hero",
            title: "الوكالة",
            order: 1,
            content: {
              headline: "نحوّل أفكارك إلى نتائج ملموسة",
              subheadline: "وكالة تسويق رقمي متكاملة",
              buttonText: "احصل على استشارة مجانية",
              buttonUrl: "#contact",
              backgroundType: "gradient"
            }
          },
          {
            id: "features-9",
            type: "features",
            title: "خدماتنا",
            order: 2,
            content: {
              items: [
                { icon: "Target", title: "إعلانات مدفوعة", description: "حملات إعلانية فعالة" },
                { icon: "Search", title: "تحسين محركات البحث", description: "ظهور أفضل في Google" },
                { icon: "Share2", title: "إدارة السوشيال ميديا", description: "تواجد قوي على المنصات" },
                { icon: "PenTool", title: "تصميم الهوية", description: "هوية بصرية متميزة" }
              ]
            }
          },
          {
            id: "about-9",
            type: "about",
            title: "من نحن",
            order: 3,
            content: {
              name: "وكالة النجاح الرقمي",
              bio: "فريق من الخبراء المتخصصين في التسويق الرقمي",
              achievements: ["500+ عميل", "1000+ حملة ناجحة", "10M+ وصول"]
            }
          },
          {
            id: "testimonials-9",
            type: "testimonials",
            title: "قصص نجاح عملائنا",
            order: 4,
            content: {
              items: [
                { name: "شركة الأفق", role: "تجارة إلكترونية", text: "زادت مبيعاتنا 300%", avatar: "" },
                { name: "مؤسسة البدر", role: "خدمات", text: "أفضل قرار اتخذناه", avatar: "" }
              ]
            }
          },
          {
            id: "pricing-9",
            type: "pricing",
            title: "باقاتنا",
            order: 5,
            content: {
              plans: [
                { name: "البداية", price: "2000", features: ["إدارة منصتين", "تقارير شهرية"] },
                { name: "النمو", price: "5000", features: ["إدارة 4 منصات", "إعلانات", "تقارير أسبوعية"] },
                { name: "الاحتراف", price: "10000", features: ["إدارة كاملة", "فريق مخصص", "دعم 24/7"] }
              ]
            }
          },
          {
            id: "contact-9",
            type: "contact",
            title: "تواصل معنا",
            order: 6,
            content: {
              fields: ["name", "email", "phone", "company", "message"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 10,
    name: "قالب التجميل والعناية",
    category: "الصحة واللياقة",
    description: "قالب أنثوي لصالونات التجميل",
    thumbnail: "beauty",
    isPopular: false,
    uses: 680,
    pages: [
      {
        id: "sales-10",
        name: "صفحة الصالون",
        type: "sales",
        settings: {
          primaryColor: "#be185d",
          secondaryColor: "#f472b6",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-10",
            type: "hero",
            title: "الصالون",
            order: 1,
            content: {
              headline: "جمالك يستحق الأفضل",
              subheadline: "خدمات تجميل وعناية احترافية",
              buttonText: "احجزي موعدك",
              buttonUrl: "#booking",
              backgroundType: "image"
            }
          },
          {
            id: "features-10",
            type: "features",
            title: "خدماتنا",
            order: 2,
            content: {
              items: [
                { icon: "Scissors", title: "قص وتصفيف", description: "أحدث صيحات الموضة" },
                { icon: "Sparkles", title: "عناية بالبشرة", description: "علاجات متخصصة" },
                { icon: "Heart", title: "مكياج", description: "مكياج للمناسبات" }
              ]
            }
          },
          {
            id: "gallery-10",
            type: "gallery",
            title: "أعمالنا",
            order: 3,
            content: {
              images: []
            }
          },
          {
            id: "pricing-10",
            type: "pricing",
            title: "الأسعار",
            order: 4,
            content: {
              services: [
                { name: "قص شعر", price: "150" },
                { name: "صبغة كاملة", price: "500" },
                { name: "تنظيف بشرة", price: "300" },
                { name: "مكياج سهرة", price: "400" }
              ]
            }
          },
          {
            id: "contact-10",
            type: "contact",
            title: "احجزي موعدك",
            order: 5,
            content: {
              fields: ["name", "phone", "service", "date"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 11,
    name: "قالب الكتاب الإلكتروني",
    category: "الدورات التدريبية",
    description: "قالب لبيع الكتب والمنتجات الرقمية",
    thumbnail: "ebook",
    isPopular: true,
    uses: 1350,
    pages: [
      {
        id: "sales-11",
        name: "صفحة الكتاب",
        type: "sales",
        settings: {
          primaryColor: "#0d9488",
          secondaryColor: "#f59e0b",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-11",
            type: "hero",
            title: "الكتاب",
            order: 1,
            content: {
              headline: "الدليل الشامل للنجاح في التجارة الإلكترونية",
              subheadline: "كل ما تحتاجه للبدء وتحقيق أرباح حقيقية",
              buttonText: "احصل على نسختك الآن",
              buttonUrl: "#buy",
              backgroundType: "gradient"
            }
          },
          {
            id: "features-11",
            type: "features",
            title: "ماذا ستجد في الكتاب؟",
            order: 2,
            content: {
              items: [
                { icon: "BookOpen", title: "10 فصول متكاملة", description: "محتوى شامل ومنظم" },
                { icon: "FileText", title: "قوالب جاهزة", description: "قوالب للاستخدام الفوري" },
                { icon: "Video", title: "فيديوهات تعليمية", description: "شرح عملي خطوة بخطوة" },
                { icon: "Users", title: "مجتمع خاص", description: "انضم لمجتمع المتعلمين" }
              ]
            }
          },
          {
            id: "bonus-11",
            type: "bonus",
            title: "هدايا حصرية مع الكتاب",
            order: 3,
            content: {
              items: [
                { title: "قائمة الموردين السرية", value: "197$" },
                { title: "حاسبة الأرباح", value: "97$" },
                { title: "دليل الإعلانات", value: "297$" }
              ]
            }
          },
          {
            id: "testimonials-11",
            type: "testimonials",
            title: "ماذا يقول القراء؟",
            order: 4,
            content: {
              items: [
                { name: "عبدالله", text: "غير نظرتي للتجارة الإلكترونية تماماً", rating: 5 },
                { name: "هند", text: "بدأت متجري وحققت أول ربح خلال شهر", rating: 5 }
              ]
            }
          },
          {
            id: "pricing-11",
            type: "pricing",
            title: "احصل على الكتاب الآن",
            order: 5,
            content: {
              originalPrice: "497",
              salePrice: "97",
              currency: "ر.س",
              buttonText: "اشتري الآن",
              features: ["الكتاب الإلكتروني كاملاً", "جميع الهدايا", "تحديثات مجانية"]
            }
          },
          {
            id: "faq-11",
            type: "faq",
            title: "أسئلة شائعة",
            order: 6,
            content: {
              items: [
                { question: "كيف أستلم الكتاب؟", answer: "يصلك فوراً على بريدك الإلكتروني" },
                { question: "هل يوجد ضمان؟", answer: "نعم، ضمان استرداد 30 يوم" }
              ]
            }
          }
        ]
      },
      {
        id: "thankyou-11",
        name: "صفحة الشكر",
        type: "thankyou",
        settings: {
          primaryColor: "#0d9488",
          secondaryColor: "#f59e0b",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty11",
            type: "hero",
            title: "شكراً لك!",
            order: 1,
            content: {
              headline: "📚 تم شراء الكتاب بنجاح!",
              subheadline: "تفقد بريدك الإلكتروني للحصول على رابط التحميل",
              buttonText: "تحميل الكتاب",
              buttonUrl: "/download"
            }
          }
        ]
      }
    ]
  },
  {
    id: 12,
    name: "قالب المحامي",
    category: "الخدمات",
    description: "قالب احترافي للمحامين والمستشارين القانونيين",
    thumbnail: "lawyer",
    isPopular: false,
    uses: 420,
    pages: [
      {
        id: "sales-12",
        name: "صفحة المكتب",
        type: "sales",
        settings: {
          primaryColor: "#1e3a5f",
          secondaryColor: "#b8860b",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-12",
            type: "hero",
            title: "المكتب",
            order: 1,
            content: {
              headline: "خبرة قانونية تحمي حقوقك",
              subheadline: "أكثر من 20 عاماً في المحاماة والاستشارات القانونية",
              buttonText: "احجز استشارتك",
              buttonUrl: "#consult",
              backgroundType: "image"
            }
          },
          {
            id: "features-12",
            type: "features",
            title: "مجالات التخصص",
            order: 2,
            content: {
              items: [
                { icon: "Scale", title: "القضايا التجارية", description: "حل النزاعات التجارية" },
                { icon: "Building2", title: "قضايا الشركات", description: "تأسيس وتنظيم الشركات" },
                { icon: "Users", title: "الأحوال الشخصية", description: "قضايا الأسرة" },
                { icon: "FileCheck", title: "العقود", description: "صياغة ومراجعة العقود" }
              ]
            }
          },
          {
            id: "about-12",
            type: "about",
            title: "عن المحامي",
            order: 3,
            content: {
              name: "المحامي أحمد الصالح",
              bio: "محامي معتمد لدى جميع المحاكم",
              achievements: ["500+ قضية ناجحة", "20 سنة خبرة", "عضو هيئة المحامين"]
            }
          },
          {
            id: "testimonials-12",
            type: "testimonials",
            title: "آراء العملاء",
            order: 4,
            content: {
              items: [
                { name: "شركة الأمل", text: "أفضل مكتب محاماة تعاملنا معه", rating: 5 }
              ]
            }
          },
          {
            id: "contact-12",
            type: "contact",
            title: "احجز استشارتك",
            order: 5,
            content: {
              fields: ["name", "phone", "email", "case_type", "message"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 13,
    name: "قالب التصوير الفوتوغرافي",
    category: "الخدمات",
    description: "قالب إبداعي للمصورين",
    thumbnail: "photography",
    isPopular: false,
    uses: 560,
    pages: [
      {
        id: "sales-13",
        name: "صفحة المصور",
        type: "sales",
        settings: {
          primaryColor: "#18181b",
          secondaryColor: "#a855f7",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-13",
            type: "hero",
            title: "المصور",
            order: 1,
            content: {
              headline: "نلتقط أجمل لحظاتك",
              subheadline: "تصوير احترافي للمناسبات والمنتجات",
              buttonText: "احجز جلستك",
              buttonUrl: "#book",
              backgroundType: "image"
            }
          },
          {
            id: "gallery-13",
            type: "gallery",
            title: "معرض الأعمال",
            order: 2,
            content: {
              images: [],
              categories: ["حفلات", "منتجات", "بورتريه", "مناظر"]
            }
          },
          {
            id: "features-13",
            type: "features",
            title: "خدماتنا",
            order: 3,
            content: {
              items: [
                { icon: "Camera", title: "تصوير المناسبات", description: "حفلات زفاف وتخرج" },
                { icon: "Package", title: "تصوير المنتجات", description: "للمتاجر الإلكترونية" },
                { icon: "User", title: "جلسات تصوير", description: "بورتريه شخصي" }
              ]
            }
          },
          {
            id: "pricing-13",
            type: "pricing",
            title: "باقات التصوير",
            order: 4,
            content: {
              plans: [
                { name: "الأساسية", price: "500", features: ["جلسة ساعة", "20 صورة معدلة"] },
                { name: "المتقدمة", price: "1500", features: ["جلسة 3 ساعات", "50 صورة معدلة", "ألبوم"] },
                { name: "الاحترافية", price: "3000", features: ["يوم كامل", "صور غير محدودة", "فيديو قصير"] }
              ]
            }
          },
          {
            id: "contact-13",
            type: "contact",
            title: "احجز موعدك",
            order: 5,
            content: {
              fields: ["name", "phone", "event_type", "date"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 14,
    name: "قالب البودكاست",
    category: "الدورات التدريبية",
    description: "قالب عصري للبودكاست",
    thumbnail: "podcast",
    isPopular: true,
    uses: 890,
    pages: [
      {
        id: "optin-14",
        name: "صفحة الاشتراك",
        type: "optin",
        settings: {
          primaryColor: "#7c3aed",
          secondaryColor: "#ec4899",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-14",
            type: "hero",
            title: "البودكاست",
            order: 1,
            content: {
              headline: "بودكاست رحلة النجاح",
              subheadline: "حلقات أسبوعية مع رواد الأعمال الناجحين",
              buttonText: "اشترك الآن",
              buttonUrl: "#subscribe"
            }
          },
          {
            id: "features-14",
            type: "features",
            title: "لماذا تشترك؟",
            order: 2,
            content: {
              items: [
                { icon: "Mic", title: "حلقات حصرية", description: "محتوى غير متاح للعامة" },
                { icon: "Gift", title: "هدايا للمشتركين", description: "موارد وأدوات مجانية" },
                { icon: "Users", title: "مجتمع خاص", description: "تواصل مع رواد أعمال" }
              ]
            }
          },
          {
            id: "testimonials-14",
            type: "testimonials",
            title: "آراء المستمعين",
            order: 3,
            content: {
              items: [
                { name: "سعود", text: "أفضل بودكاست عربي للأعمال" },
                { name: "مريم", text: "ألهمني لبدء مشروعي الخاص" }
              ]
            }
          },
          {
            id: "contact-14",
            type: "contact",
            title: "اشترك الآن",
            order: 4,
            content: {
              fields: ["name", "email"]
            }
          }
        ]
      }
    ]
  },
  {
    id: 15,
    name: "قالب الحدث والمؤتمر",
    category: "الدورات التدريبية",
    description: "قالب للأحداث والمؤتمرات",
    thumbnail: "event",
    isPopular: false,
    uses: 340,
    pages: [
      {
        id: "optin-15",
        name: "صفحة التسجيل",
        type: "optin",
        settings: {
          primaryColor: "#ea580c",
          secondaryColor: "#0891b2",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-15",
            type: "hero",
            title: "المؤتمر",
            order: 1,
            content: {
              headline: "مؤتمر التحول الرقمي 2025",
              subheadline: "أكبر تجمع للخبراء والمختصين",
              buttonText: "سجل الآن",
              buttonUrl: "#register",
              backgroundType: "image"
            }
          },
          {
            id: "countdown-15",
            type: "countdown",
            title: "العد التنازلي",
            order: 2,
            content: {
              endDate: "2025-06-15T09:00:00"
            }
          },
          {
            id: "features-15",
            type: "features",
            title: "ماذا ينتظرك؟",
            order: 3,
            content: {
              items: [
                { icon: "Mic2", title: "20+ متحدث", description: "خبراء من مختلف المجالات" },
                { icon: "BookOpen", title: "15 ورشة عمل", description: "تعلم عملي تفاعلي" },
                { icon: "Users", title: "500+ مشارك", description: "فرصة للتواصل والتشبيك" }
              ]
            }
          },
          {
            id: "pricing-15",
            type: "pricing",
            title: "التذاكر",
            order: 4,
            content: {
              plans: [
                { name: "الحضور العادي", price: "500", features: ["حضور المؤتمر", "شهادة حضور"] },
                { name: "VIP", price: "1500", features: ["مقاعد أمامية", "غداء خاص", "لقاء المتحدثين"] }
              ]
            }
          },
          {
            id: "contact-15",
            type: "contact",
            title: "سجل الآن",
            order: 5,
            content: {
              fields: ["name", "email", "phone", "company", "ticket_type"]
            }
          }
        ]
      },
      {
        id: "thankyou-15",
        name: "تأكيد التسجيل",
        type: "thankyou",
        settings: {
          primaryColor: "#ea580c",
          secondaryColor: "#0891b2",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: [
          {
            id: "hero-ty15",
            type: "hero",
            title: "تم التسجيل!",
            order: 1,
            content: {
              headline: "🎫 تم تأكيد تسجيلك في المؤتمر!",
              subheadline: "ستصلك التذكرة على بريدك الإلكتروني"
            }
          }
        ]
      }
    ]
  }
];
