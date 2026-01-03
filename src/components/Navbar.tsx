import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Mail, ChevronDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#home" },
    { name: "المميزات", href: "#features" },
    { name: "الأسعار", href: "#pricing" },
    { name: "المدونة", href: "/blog", isRoute: true },
    { name: "الإعلانات", href: "/advertisements", isRoute: true },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-foreground tracking-tight">ماركيتلي</span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1">منصة التسويق الذكية</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-3/4 transition-all duration-300" />
                </a>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="font-medium">
                تسجيل الدخول
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                size="sm" 
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  ابدأ مجاناً
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <span className={cn(
                "absolute left-0 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"
              )} />
              <span className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                isOpen ? "opacity-0 scale-0" : "opacity-100"
              )} />
              <span className={cn(
                "absolute left-0 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 ease-out",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-6 space-y-2 border-t border-border/50">
            {navLinks.map((link, index) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
            <div className="flex flex-col gap-3 pt-4 px-4">
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Sparkles className="w-4 h-4 ml-2" />
                  ابدأ مجاناً
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
