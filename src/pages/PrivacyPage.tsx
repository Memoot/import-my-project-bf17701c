import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, Server, Bell } from "lucide-react";

const PrivacyPage = () => {
  const sections = [
    {
      icon: Shield,
      title: "المعلومات التي نجمعها",
      content: `
        نجمع المعلومات التي تقدمها لنا مباشرة عند:
        • إنشاء حساب أو التسجيل في خدماتنا
        • استخدام خدماتنا وإرسال الحملات البريدية
        • التواصل معنا للحصول على الدعم
        • الاشتراك في نشرتنا البريدية
        
        تشمل هذه المعلومات: الاسم، البريد الإلكتروني، رقم الهاتف، معلومات الدفع، ومحتوى حملاتك البريدية.
      `
    },
    {
      icon: Eye,
      title: "كيف نستخدم معلوماتك",
      content: `
        نستخدم المعلومات التي نجمعها من أجل:
        • توفير وتشغيل خدماتنا
        • معالجة المعاملات والمدفوعات
        • إرسال إشعارات حول حسابك
        • تحسين خدماتنا وتطوير ميزات جديدة
        • التواصل معك بشأن العروض والتحديثات
        • حماية أمن المنصة ومنع الاحتيال
      `
    },
    {
      icon: Lock,
      title: "حماية معلوماتك",
      content: `
        نتخذ تدابير أمنية صارمة لحماية معلوماتك:
        • تشفير SSL/TLS لجميع الاتصالات
        • تشفير البيانات الحساسة في قواعد البيانات
        • مراقبة أمنية على مدار الساعة
        • مراجعات أمنية دورية
        • تقييد الوصول للموظفين المصرح لهم فقط
        • الامتثال لمعايير PCI-DSS للمدفوعات
      `
    },
    {
      icon: UserCheck,
      title: "حقوقك",
      content: `
        لديك الحق في:
        • الوصول إلى بياناتك الشخصية
        • تصحيح أي معلومات غير دقيقة
        • طلب حذف بياناتك
        • الاعتراض على معالجة بياناتك
        • نقل بياناتك إلى خدمة أخرى
        • سحب موافقتك في أي وقت
        
        يمكنك ممارسة هذه الحقوق بالتواصل معنا عبر support@marketly.com
      `
    },
    {
      icon: Server,
      title: "مشاركة البيانات",
      content: `
        لا نبيع معلوماتك الشخصية لأي طرف ثالث. قد نشارك بياناتك مع:
        • مزودي الخدمات الذين يساعدوننا في تشغيل المنصة
        • بوابات الدفع لمعالجة المعاملات
        • السلطات القانونية عند الضرورة
        
        جميع شركائنا ملتزمون بنفس معايير الخصوصية والأمان.
      `
    },
    {
      icon: Bell,
      title: "ملفات تعريف الارتباط",
      content: `
        نستخدم ملفات تعريف الارتباط (Cookies) من أجل:
        • تذكر تفضيلاتك وإعداداتك
        • تحسين تجربة المستخدم
        • تحليل استخدام الموقع
        • تقديم محتوى مخصص
        
        يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.
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
              <Shield className="w-5 h-5" />
              <span className="font-medium">سياسة الخصوصية</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن ملتزمون بحماية خصوصيتك وأمان بياناتك. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك.
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
              <h3 className="text-xl font-bold text-foreground mb-4">أسئلة حول الخصوصية؟</h3>
              <p className="text-muted-foreground mb-4">
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو ممارساتنا، يرجى التواصل معنا:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>البريد الإلكتروني: privacy@marketly.com</li>
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

export default PrivacyPage;
