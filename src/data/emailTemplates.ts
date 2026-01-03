export const emailTemplates = [
  {
    id: 1,
    name: "ترحيب بالمشتركين الجدد",
    category: "ترحيب",
    description: "قالب ترحيبي للمشتركين الجدد مع تعريف بخدماتك",
    uses: 1250,
    isPopular: true,
    subject: "مرحباً بك في عائلتنا! 🎉",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e40af 0%, #0f172a 100%); padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0;">مرحباً بك! 🎉</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 12px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">مرحباً {{الاسم}}،</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">يسعدنا انضمامك إلى عائلتنا! نحن متحمسون لمساعدتك في تحقيق أهدافك.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">ابدأ الآن</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">© 2024 رسائل برو. جميع الحقوق محفوظة.</p>
      </div>
    `,
  },
  {
    id: 2,
    name: "نشرة إخبارية أسبوعية",
    category: "نشرات",
    description: "قالب للنشرات الأسبوعية مع أقسام للمقالات والأخبار",
    uses: 890,
    isPopular: true,
    subject: "نشرتنا الأسبوعية - أحدث الأخبار والمقالات 📰",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: #1e40af; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">📰 النشرة الأسبوعية</h1>
          <p style="color: #93c5fd; margin: 10px 0 0;">العدد {{رقم_العدد}} - {{التاريخ}}</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e40af; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📌 أبرز الأخبار</h2>
          <div style="padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
            <h3 style="color: #374151; font-size: 16px; margin: 0 0 8px;">عنوان الخبر الأول</h3>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">وصف مختصر للخبر يظهر هنا...</p>
          </div>
          <div style="padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
            <h3 style="color: #374151; font-size: 16px; margin: 0 0 8px;">عنوان الخبر الثاني</h3>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">وصف مختصر للخبر يظهر هنا...</p>
          </div>
          <div style="text-align: center; margin-top: 25px;">
            <a href="#" style="background: #1e40af; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">اقرأ المزيد</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 3,
    name: "عرض خاص / تخفيضات",
    category: "عروض",
    description: "قالب للإعلان عن العروض والتخفيضات الخاصة",
    uses: 2100,
    isPopular: true,
    subject: "🔥 عرض حصري - خصم {{نسبة_الخصم}}% لفترة محدودة!",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background: #fbbf24; color: #92400e; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">🔥 عرض محدود</span>
        </div>
        <div style="text-align: center; color: #ffffff; margin-bottom: 30px;">
          <h1 style="font-size: 48px; margin: 0;">{{نسبة_الخصم}}%</h1>
          <p style="font-size: 24px; margin: 10px 0;">خصم على جميع المنتجات</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 12px; text-align: center;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">استخدم الكود التالي عند الدفع:</p>
          <div style="background: #fef3c7; border: 2px dashed #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #92400e; letter-spacing: 4px;">SALE50</span>
          </div>
          <a href="#" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">تسوق الآن</a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">العرض ساري حتى {{تاريخ_الانتهاء}}</p>
        </div>
      </div>
    `,
  },
  {
    id: 4,
    name: "إطلاق منتج جديد",
    category: "منتجات",
    description: "قالب للإعلان عن منتجات أو خدمات جديدة",
    uses: 650,
    isPopular: false,
    subject: "🚀 تعرف على منتجنا الجديد!",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="color: #22d3ee; font-size: 14px;">🚀 جديد</span>
          <h1 style="color: #ffffff; font-size: 32px; margin: 15px 0;">{{اسم_المنتج}}</h1>
          <p style="color: #94a3b8; font-size: 16px;">{{وصف_مختصر}}</p>
        </div>
        <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 40px; background: #0f172a; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #64748b;">صورة المنتج</p>
          </div>
          <ul style="color: #e2e8f0; font-size: 14px; line-height: 2; padding-right: 20px;">
            <li>✨ ميزة أولى رائعة</li>
            <li>✨ ميزة ثانية مميزة</li>
            <li>✨ ميزة ثالثة فريدة</li>
          </ul>
        </div>
        <div style="text-align: center;">
          <a href="#" style="background: linear-gradient(135deg, #22d3ee, #0891b2); color: #0f172a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">اكتشف المزيد</a>
        </div>
      </div>
    `,
  },
  {
    id: 5,
    name: "دعوة لحدث",
    category: "فعاليات",
    description: "قالب لدعوة المشتركين لحضور فعالية أو ندوة",
    uses: 420,
    isPopular: false,
    subject: "📅 دعوة خاصة: {{اسم_الحدث}}",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 48px;">📅</span>
          <h1 style="color: #ffffff; font-size: 28px; margin: 15px 0;">{{اسم_الحدث}}</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 12px;">
          <div style="display: flex; justify-content: space-around; text-align: center; margin-bottom: 25px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
            <div>
              <p style="color: #7c3aed; font-size: 12px; margin: 0;">📅 التاريخ</p>
              <p style="color: #374151; font-weight: bold; margin: 5px 0;">{{التاريخ}}</p>
            </div>
            <div>
              <p style="color: #7c3aed; font-size: 12px; margin: 0;">⏰ الوقت</p>
              <p style="color: #374151; font-weight: bold; margin: 5px 0;">{{الوقت}}</p>
            </div>
            <div>
              <p style="color: #7c3aed; font-size: 12px; margin: 0;">📍 المكان</p>
              <p style="color: #374151; font-weight: bold; margin: 5px 0;">{{المكان}}</p>
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.8; text-align: center;">{{وصف_الحدث}}</p>
          <div style="text-align: center; margin-top: 25px;">
            <a href="#" style="background: linear-gradient(135deg, #7c3aed, #4c1d95); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">سجل الآن</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 6,
    name: "قالب فارغ",
    category: "أساسي",
    description: "قالب فارغ لتصميم رسالتك من الصفر",
    uses: 3200,
    isPopular: true,
    subject: "",
    content: `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; font-size: 24px;">عنوان رسالتك هنا</h1>
        </div>
        <div style="padding: 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">مرحباً،</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.8;">اكتب محتوى رسالتك هنا...</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #1e40af; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">زر الإجراء</a>
          </div>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px;">© 2024 اسم شركتك. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    `,
  },
];
