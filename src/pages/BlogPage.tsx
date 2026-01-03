import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "كيف تبني قائمة بريدية ناجحة من الصفر",
    excerpt: "تعلم أفضل الاستراتيجيات لبناء قائمة بريدية قوية تساعدك في تحقيق أهدافك التسويقية وزيادة المبيعات.",
    category: "التسويق بالبريد",
    author: "أحمد محمد",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=60",
    readTime: "5 دقائق",
  },
  {
    id: 2,
    title: "أفضل 10 ممارسات لتصميم صفحات الهبوط",
    excerpt: "اكتشف أسرار تصميم صفحات هبوط فعالة تحول الزوار إلى عملاء بمعدلات تحويل عالية.",
    category: "صفحات الهبوط",
    author: "سارة أحمد",
    date: "2024-01-12",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60",
    readTime: "7 دقائق",
  },
  {
    id: 3,
    title: "دليلك الشامل للتسويق الإلكتروني في 2024",
    excerpt: "تعرف على أحدث التوجهات والأدوات في عالم التسويق الرقمي لتبقى في المقدمة.",
    category: "التسويق الرقمي",
    author: "محمد علي",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop&q=60",
    readTime: "10 دقائق",
  },
  {
    id: 4,
    title: "كيف تكتب رسالة بريدية لا يمكن تجاهلها",
    excerpt: "نصائح عملية لكتابة رسائل بريدية جذابة تحقق معدلات فتح ونقر عالية.",
    category: "كتابة المحتوى",
    author: "فاطمة حسن",
    date: "2024-01-08",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60",
    readTime: "6 دقائق",
  },
  {
    id: 5,
    title: "تحليلات البريد الإلكتروني: ما يجب قياسه",
    excerpt: "فهم المقاييس الأساسية لقياس نجاح حملاتك البريدية وتحسينها باستمرار.",
    category: "التحليلات",
    author: "خالد عمر",
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    readTime: "8 دقائق",
  },
  {
    id: 6,
    title: "أتمتة التسويق: وفر وقتك وزد أرباحك",
    excerpt: "تعلم كيفية إعداد حملات آلية تعمل على مدار الساعة لتوليد العملاء والمبيعات.",
    category: "الأتمتة",
    author: "نورة سعيد",
    date: "2024-01-02",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop&q=60",
    readTime: "9 دقائق",
  },
];

const categories = ["الكل", "التسويق بالبريد", "صفحات الهبوط", "التسويق الرقمي", "كتابة المحتوى", "التحليلات", "الأتمتة"];

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.includes(searchQuery) || post.excerpt.includes(searchQuery);
    const matchesCategory = selectedCategory === "الكل" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background font-cairo">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">المدونة</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              مقالات ونصائح في التسويق الإلكتروني
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              اكتشف أحدث الاستراتيجيات والنصائح لتطوير مهاراتك في التسويق الرقمي
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث في المقالات..."
                className="pr-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary-gradient" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3">
                        {post.category}
                      </Badge>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString("ar-SA")}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          قراءة {post.readTime}
                        </span>
                        <Button variant="ghost" size="sm" className="group-hover:text-primary">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">لا توجد مقالات</h3>
                <p className="text-muted-foreground">لم نجد مقالات تطابق بحثك</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-primary/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  اشترك في نشرتنا البريدية
                </h2>
                <p className="text-muted-foreground mb-6">
                  احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input placeholder="بريدك الإلكتروني" className="flex-1" />
                  <Button className="bg-primary-gradient">اشترك الآن</Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
