import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ArrowUp, 
  Heart,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = forwardRef<HTMLElement>((props, ref) => {
  const footerLinks = {
    product: {
      title: "المنتج",
      links: [
        { name: "المميزات", href: "#features" },
        { name: "الأسعار", href: "#pricing" },
        { name: "التكاملات", href: "#" },
        { name: "التحديثات", href: "#" },
        { name: "خارطة الطريق", href: "#" },
      ],
    },
    company: {
      title: "الشركة",
      links: [
        { name: "من نحن", href: "/about", isRoute: true },
        { name: "المدونة", href: "/blog", isRoute: true },
        { name: "الوظائف", href: "#" },
        { name: "الشركاء", href: "#" },
        { name: "الإعلانات", href: "/advertisements", isRoute: true },
      ],
    },
    support: {
      title: "الدعم",
      links: [
        { name: "مركز المساعدة", href: "#" },
        { name: "الوثائق", href: "#" },
        { name: "تواصل معنا", href: "#contact" },
        { name: "حالة الخدمة", href: "#" },
        { name: "API", href: "#" },
      ],
    },
    legal: {
      title: "قانوني",
      links: [
        { name: "سياسة الخصوصية", href: "/privacy", isRoute: true },
        { name: "شروط الاستخدام", href: "/terms", isRoute: true },
        { name: "اتفاقية الخدمة", href: "#" },
        { name: "سياسة الإرجاع", href: "#" },
        { name: "GDPR", href: "#" },
      ],
    },
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "تويتر", color: "hover:bg-[#1DA1F2]" },
    { icon: Instagram, href: "#", label: "انستقرام", color: "hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
    { icon: Linkedin, href: "#", label: "لينكد إن", color: "hover:bg-[#0077B5]" },
    { icon: Youtube, href: "#", label: "يوتيوب", color: "hover:bg-[#FF0000]" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="relative bg-foreground text-background overflow-hidden" {...props}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-background/10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-background/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">اشترك في نشرتنا البريدية</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              احصل على آخر التحديثات والنصائح
            </h3>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              انضم لأكثر من 10,000 مسوّق يحصلون على أفضل النصائح والاستراتيجيات مباشرة في بريدهم
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="pr-10 h-12 bg-background text-foreground border-0 rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold"
              >
                <Send className="w-4 h-4 ml-2" />
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-lg" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">ماركيتلي</span>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed max-w-xs">
              منصة التسويق العربي الأولى. نساعدك على الوصول لعملائك بطريقة ذكية وفعالة باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-background/70">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm" dir="ltr">+966 50 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">support@marketly.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:text-white transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-lg mb-5 relative inline-block">
                {section.title}
                <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-gradient-to-l from-emerald-500 to-transparent rounded-full" />
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-background/70 hover:text-background hover:translate-x-1 transition-all duration-200 inline-block text-sm"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-background/70 hover:text-background hover:translate-x-1 transition-all duration-200 inline-block text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} ماركيتلي. جميع الحقوق محفوظة.
            </p>
            <p className="text-background/60 text-sm flex items-center gap-1">
              صُنع بـ <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" /> في المملكة العربية السعودية
            </p>
            
            {/* Back to Top Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-background/10 hover:bg-background/20 text-background"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
