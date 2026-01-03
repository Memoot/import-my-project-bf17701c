import { Mail, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: {
      title: "المنتج",
      links: [
        { name: "المميزات", href: "#features" },
        { name: "الأسعار", href: "#pricing" },
        { name: "التكاملات", href: "#" },
        { name: "التحديثات", href: "#" },
      ],
    },
    company: {
      title: "الشركة",
      links: [
        { name: "من نحن", href: "#" },
        { name: "المدونة", href: "#" },
        { name: "الوظائف", href: "#" },
        { name: "الشركاء", href: "#" },
      ],
    },
    support: {
      title: "الدعم",
      links: [
        { name: "مركز المساعدة", href: "#" },
        { name: "الوثائق", href: "#" },
        { name: "تواصل معنا", href: "#contact" },
        { name: "حالة الخدمة", href: "#" },
      ],
    },
    legal: {
      title: "قانوني",
      links: [
        { name: "سياسة الخصوصية", href: "#" },
        { name: "شروط الاستخدام", href: "#" },
        { name: "اتفاقية الخدمة", href: "#" },
        { name: "سياسة الإرجاع", href: "#" },
      ],
    },
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "تويتر" },
    { icon: Instagram, href: "#", label: "انستقرام" },
    { icon: Linkedin, href: "#", label: "لينكد إن" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xl font-bold">ماركيتلي</span>
            </a>
            <p className="text-background/70 mb-6 leading-relaxed">
              منصة التسويق العربي الأولى. نساعدك على الوصول لعملائك بطريقة ذكية وفعالة.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} ماركيتلي. جميع الحقوق محفوظة.
            </p>
            <p className="text-background/60 text-sm">
              صُنع بـ ❤️ في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
