import { useActiveAdvertisements, useIncrementAdClick } from "@/hooks/useAdvertisements";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ExternalLink, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdsSection = () => {
  const { data: ads, isLoading } = useActiveAdvertisements();
  const incrementClick = useIncrementAdClick();

  const handleAdClick = (adId: string, linkUrl: string | null) => {
    incrementClick.mutate(adId);
    if (linkUrl) {
      window.open(linkUrl, "_blank");
    }
  };

  return (
    <section id="ads" className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Megaphone className="w-4 h-4" />
            <span className="text-sm font-medium">الإعلانات</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            أضف إعلانك هنا
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            احصل على فرصة الوصول لآلاف الزوار يومياً من خلال إعلانك المميز
          </p>
        </div>

        {/* Ads Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : ads && ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ads.slice(0, 6).map((ad) => (
              <Card
                key={ad.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm"
                onClick={() => handleAdClick(ad.id, ad.link_url)}
              >
                {ad.is_featured && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                    <Sparkles className="w-3 h-3 ml-1" />
                    مميز
                  </Badge>
                )}
                
                <div className="aspect-video relative overflow-hidden">
                  {ad.image_url ? (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Megaphone className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {ad.title}
                  </h3>
                  {ad.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {ad.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {ad.advertiser_name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              لا توجد إعلانات حالياً
            </h3>
            <p className="text-muted-foreground">
              كن أول من يضيف إعلانه هنا!
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-20" />
          <Card className="relative p-8 md:p-12 bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  هل تريد الإعلان معنا؟
                </h3>
                <p className="text-muted-foreground">
                  احصل على أفضل الأسعار والوصول لجمهور واسع
                </p>
              </div>
              <Link to="/advertisements">
                <Button size="lg" className="bg-primary-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group">
                  تصفح باقات الإعلانات
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdsSection;
