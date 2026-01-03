import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, CheckCircle, AlertCircle, CreditCard, Shield, Users, Scale } from "lucide-react";

const TermsPage = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: "قبول الشروط",
      content: `
        باستخدامك لمنصة ماركيتلي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
        
        نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
      `
    },
    {
      icon: Users,
      title: "حسابك",
      content: `
        • يجب أن يكون عمرك 18 عاماً أو أكثر لاستخدام خدماتنا
        • أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك
        • يجب تقديم معلومات صحيحة ودقيقة عند التسجيل
        • لا يجوز مشاركة حسابك مع الآخرين
        • أنت مسؤول عن جميع الأنشطة التي تتم من خلال حسابك
        • يحق لنا تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط
      `
    },
    {
      icon: AlertCircle,
      title: "الاستخدام المقبول",
      content: `
        توافق على عدم استخدام المنصة في:
        • إرسال رسائل غير مرغوب فيها (Spam)
        • انتهاك حقوق الملكية الفكرية للآخرين
        • نشر محتوى غير قانوني أو مسيء
        • محاولة اختراق أو تعطيل الخدمة
        • انتحال شخصية الآخرين
        • جمع بيانات المستخدمين بدون إذن
        • استخدام الخدمة لأغراض احتيالية
        
        نحتفظ بالحق في إزالة أي محتوى ينتهك هذه السياسات.
      `
    },
    {
      icon: CreditCard,
      title: "الدفع والفوترة",
      content: `
        • جميع الأسعار معروضة بالدولار الأمريكي ($)
        • يتم تجديد الاشتراكات تلقائياً ما لم يتم إلغاؤها
        • يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب
        • لا نقدم استردادات للفترات الجزئية
        • نحتفظ بالحق في تغيير الأسعار مع إخطار مسبق
        • في حالة فشل الدفع، قد يتم تعليق الخدمة
      `
    },
    {
      icon: Shield,
      title: "الملكية الفكرية",
      content: `
        • جميع حقوق الملكية الفكرية للمنصة محفوظة لنا
        • لا يجوز نسخ أو توزيع أو تعديل أي جزء من المنصة
        • تمنحنا ترخيصاً لاستخدام المحتوى الذي تنشئه على المنصة
        • أنت تحتفظ بملكية المحتوى الخاص بك
        • نحترم حقوق الملكية الفكرية للآخرين
      `
    },
    {
      icon: Scale,
      title: "إخلاء المسؤولية",
      content: `
        • نقدم الخدمة "كما هي" دون ضمانات صريحة أو ضمنية
        • لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء
        • لسنا مسؤولين عن أي أضرار ناتجة عن استخدام الخدمة
        • لا نتحمل مسؤولية محتوى الرسائل التي ترسلها
        • أنت مسؤول عن الامتثال للقوانين المحلية
        
        الحد الأقصى لمسؤوليتنا لا يتجاوز المبلغ الذي دفعته لنا في آخر 12 شهراً.
      `
    },
  ];

  return (
    <div className="min-h-screen bg-background font-tajawal">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
              <FileText className="w-5 h-5" />
              <span className="font-medium">الشروط والأحكام</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              شروط الاستخدام
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة ماركيتلي
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={section.title} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {section.content.trim()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < sections.length - 1 && (
                    <div className="border-b border-border my-8" />
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h3 className="text-xl font-bold text-foreground mb-4">أسئلة حول الشروط؟</h3>
              <p className="text-muted-foreground mb-4">
                إذا كانت لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>البريد الإلكتروني: legal@marketly.com</li>
                <li>الهاتف: +966 50 000 0000</li>
                <li>العنوان: الرياض، المملكة العربية السعودية</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
