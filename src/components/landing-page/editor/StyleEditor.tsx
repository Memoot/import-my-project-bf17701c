import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Link,
  ExternalLink,
  Palette,
  Type,
  Image,
  Plus,
  Trash2,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
} from "lucide-react";
import { ElementStyle, FONT_SIZES, FONT_WEIGHTS } from "./types";

interface StyleEditorProps {
  elementType: string;
  style: ElementStyle;
  content: any;
  onStyleChange: (style: Partial<ElementStyle>) => void;
  onContentChange: (content: any) => void;
}

const SOCIAL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
];

const SHAPE_OPTIONS = [
  { id: 'circle', icon: Circle, label: 'دائرة' },
  { id: 'square', icon: Square, label: 'مربع' },
  { id: 'triangle', icon: Triangle, label: 'مثلث' },
  { id: 'hexagon', icon: Hexagon, label: 'سداسي' },
];

const LIST_ICONS = [
  'CheckCircle', 'Check', 'Star', 'ArrowRight', 'Dot', 'ChevronLeft'
];

export function StyleEditor({
  elementType,
  style,
  content,
  onStyleChange,
  onContentChange,
}: StyleEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="p-3 border-b bg-muted/30">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="content" className="text-xs">المحتوى</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">التنسيق</TabsTrigger>
            <TabsTrigger value="link" className="text-xs">الروابط</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="m-0 p-4 space-y-4">
            {/* محتوى النص والعنوان */}
            {(elementType === 'text' || elementType === 'heading') && (
              <div className="space-y-2">
                <Label>النص</Label>
                <Textarea
                  value={content.text || ''}
                  onChange={(e) => onContentChange({ ...content, text: e.target.value })}
                  placeholder="أدخل النص..."
                  className="min-h-[100px]"
                />
              </div>
            )}

            {/* محتوى الزر */}
            {elementType === 'button' && (
              <>
                <div className="space-y-2">
                  <Label>نص الزر</Label>
                  <Input
                    value={content.text || ''}
                    onChange={(e) => onContentChange({ ...content, text: e.target.value })}
                    placeholder="ابدأ الآن"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>حجم الزر</Label>
                    <Select
                      value={content.size || 'md'}
                      onValueChange={(value) => onContentChange({ ...content, size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">صغير</SelectItem>
                        <SelectItem value="md">متوسط</SelectItem>
                        <SelectItem value="lg">كبير</SelectItem>
                        <SelectItem value="xl">كبير جداً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>نمط الزر</Label>
                    <Select
                      value={content.variant || 'primary'}
                      onValueChange={(value) => onContentChange({ ...content, variant: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">رئيسي</SelectItem>
                        <SelectItem value="secondary">ثانوي</SelectItem>
                        <SelectItem value="outline">مفرغ</SelectItem>
                        <SelectItem value="gradient">متدرج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* محتوى الصورة */}
            {elementType === 'image' && (
              <>
                <div className="space-y-2">
                  <Label>رابط الصورة</Label>
                  <Input
                    value={content.src || ''}
                    onChange={(e) => onContentChange({ ...content, src: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>النص البديل</Label>
                  <Input
                    value={content.alt || ''}
                    onChange={(e) => onContentChange({ ...content, alt: e.target.value })}
                    placeholder="وصف الصورة..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>طريقة الملء</Label>
                  <Select
                    value={content.objectFit || 'cover'}
                    onValueChange={(value) => onContentChange({ ...content, objectFit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">تغطية</SelectItem>
                      <SelectItem value="contain">احتواء</SelectItem>
                      <SelectItem value="fill">ملء</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* محتوى الفيديو */}
            {elementType === 'video' && (
              <>
                <div className="space-y-2">
                  <Label>رابط الفيديو</Label>
                  <Input
                    value={content.url || ''}
                    onChange={(e) => onContentChange({ ...content, url: e.target.value })}
                    placeholder="رابط يوتيوب أو فيميو..."
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>تشغيل تلقائي</Label>
                  <Switch
                    checked={content.autoplay || false}
                    onCheckedChange={(checked) => onContentChange({ ...content, autoplay: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label>إظهار التحكم</Label>
                  <Switch
                    checked={content.controls !== false}
                    onCheckedChange={(checked) => onContentChange({ ...content, controls: checked })}
                  />
                </div>
              </>
            )}

            {/* العداد التنازلي */}
            {elementType === 'countdown' && (
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <Input
                  type="datetime-local"
                  value={content.endDate ? new Date(content.endDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => onContentChange({ ...content, endDate: new Date(e.target.value).toISOString() })}
                />
              </div>
            )}

            {/* المسافة */}
            {elementType === 'spacer' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>الارتفاع</Label>
                  <span className="text-sm text-muted-foreground">{content.height || 40}px</span>
                </div>
                <Slider
                  value={[content.height || 40]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={([value]) => onContentChange({ ...content, height: value })}
                />
              </div>
            )}

            {/* الفاصل */}
            {elementType === 'divider' && (
              <>
                <div className="space-y-2">
                  <Label>نمط الخط</Label>
                  <Select
                    value={content.style || 'solid'}
                    onValueChange={(value) => onContentChange({ ...content, style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">متصل</SelectItem>
                      <SelectItem value="dashed">متقطع</SelectItem>
                      <SelectItem value="dotted">منقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>السماكة</Label>
                    <span className="text-sm text-muted-foreground">{content.thickness || 1}px</span>
                  </div>
                  <Slider
                    value={[content.thickness || 1]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([value]) => onContentChange({ ...content, thickness: value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.color || '#e5e7eb'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="w-10 h-8 rounded cursor-pointer border"
                    />
                    <Input
                      value={content.color || '#e5e7eb'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* معرض الصور */}
            {elementType === 'gallery' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>الصور</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onContentChange({ 
                        ...content, 
                        images: [...(content.images || []), { src: '', alt: '' }] 
                      })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(content.images || []).map((img: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={img.src}
                          onChange={(e) => {
                            const newImages = [...content.images];
                            newImages[idx] = { ...img, src: e.target.value };
                            onContentChange({ ...content, images: newImages });
                          }}
                          placeholder="رابط الصورة"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newImages = content.images.filter((_: any, i: number) => i !== idx);
                            onContentChange({ ...content, images: newImages });
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>الأعمدة</Label>
                    <Select
                      value={String(content.columns || 3)}
                      onValueChange={(value) => onContentChange({ ...content, columns: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>النمط</Label>
                    <Select
                      value={content.style || 'grid'}
                      onValueChange={(value) => onContentChange({ ...content, style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">شبكة</SelectItem>
                        <SelectItem value="masonry">متفاوت</SelectItem>
                        <SelectItem value="carousel">عرض شرائح</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* الخريطة */}
            {elementType === 'map' && (
              <>
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input
                    value={content.address || ''}
                    onChange={(e) => onContentChange({ ...content, address: e.target.value })}
                    placeholder="الرياض، المملكة العربية السعودية"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>خط العرض</Label>
                    <Input
                      type="number"
                      value={content.latitude || ''}
                      onChange={(e) => onContentChange({ ...content, latitude: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>خط الطول</Label>
                    <Input
                      type="number"
                      value={content.longitude || ''}
                      onChange={(e) => onContentChange({ ...content, longitude: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>الارتفاع</Label>
                    <span className="text-sm text-muted-foreground">{content.height || 300}px</span>
                  </div>
                  <Slider
                    value={[content.height || 300]}
                    min={200}
                    max={600}
                    step={50}
                    onValueChange={([value]) => onContentChange({ ...content, height: value })}
                  />
                </div>
              </>
            )}

            {/* أيقونات التواصل */}
            {elementType === 'social' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>الروابط</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onContentChange({ 
                        ...content, 
                        links: [...(content.links || []), { platform: 'facebook', url: '' }] 
                      })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(content.links || []).map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Select
                          value={link.platform}
                          onValueChange={(value) => {
                            const newLinks = [...content.links];
                            newLinks[idx] = { ...link, platform: value };
                            onContentChange({ ...content, links: newLinks });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_PLATFORMS.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...content.links];
                            newLinks[idx] = { ...link, url: e.target.value };
                            onContentChange({ ...content, links: newLinks });
                          }}
                          placeholder="الرابط"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newLinks = content.links.filter((_: any, i: number) => i !== idx);
                            onContentChange({ ...content, links: newLinks });
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>النمط</Label>
                    <Select
                      value={content.style || 'colored'}
                      onValueChange={(value) => onContentChange({ ...content, style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colored">ملون</SelectItem>
                        <SelectItem value="outlined">مفرغ</SelectItem>
                        <SelectItem value="minimal">بسيط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الحجم</Label>
                    <Select
                      value={content.size || 'md'}
                      onValueChange={(value) => onContentChange({ ...content, size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">صغير</SelectItem>
                        <SelectItem value="md">متوسط</SelectItem>
                        <SelectItem value="lg">كبير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* كود مضمن */}
            {elementType === 'embed' && (
              <div className="space-y-2">
                <Label>الكود</Label>
                <Textarea
                  value={content.code || ''}
                  onChange={(e) => onContentChange({ ...content, code: e.target.value })}
                  placeholder="<iframe>...</iframe> أو HTML مخصص"
                  className="font-mono text-xs min-h-[150px]"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  يمكنك إضافة أي كود HTML أو تضمين خارجي
                </p>
              </div>
            )}

            {/* الشكل */}
            {elementType === 'shape' && (
              <>
                <div className="space-y-2">
                  <Label>الشكل</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {SHAPE_OPTIONS.map(shape => {
                      const ShapeIcon = shape.icon;
                      return (
                        <Button
                          key={shape.id}
                          variant={content.shape === shape.id ? 'secondary' : 'outline'}
                          className="h-12 flex flex-col gap-1"
                          onClick={() => onContentChange({ ...content, shape: shape.id })}
                        >
                          <ShapeIcon className="w-5 h-5" />
                          <span className="text-[10px]">{shape.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.color || '#3b82f6'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="w-10 h-8 rounded cursor-pointer border"
                    />
                    <Input
                      value={content.color || '#3b82f6'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>الحجم</Label>
                    <span className="text-sm text-muted-foreground">{content.size || 100}px</span>
                  </div>
                  <Slider
                    value={[content.size || 100]}
                    min={20}
                    max={300}
                    step={10}
                    onValueChange={([value]) => onContentChange({ ...content, size: value })}
                  />
                </div>
              </>
            )}

            {/* القائمة */}
            {elementType === 'list' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>العناصر</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onContentChange({ 
                        ...content, 
                        items: [...(content.items || []), 'عنصر جديد'] 
                      })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(content.items || []).map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = e.target.value;
                            onContentChange({ ...content, items: newItems });
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newItems = content.items.filter((_: any, i: number) => i !== idx);
                            onContentChange({ ...content, items: newItems });
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>النمط</Label>
                    <Select
                      value={content.style || 'bullet'}
                      onValueChange={(value) => onContentChange({ ...content, style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bullet">نقطي</SelectItem>
                        <SelectItem value="numbered">مرقم</SelectItem>
                        <SelectItem value="icon">أيقونات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الأيقونة</Label>
                    <Select
                      value={content.icon || 'CheckCircle'}
                      onValueChange={(value) => onContentChange({ ...content, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LIST_ICONS.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* الاقتباس */}
            {elementType === 'quote' && (
              <>
                <div className="space-y-2">
                  <Label>النص</Label>
                  <Textarea
                    value={content.text || ''}
                    onChange={(e) => onContentChange({ ...content, text: e.target.value })}
                    placeholder="اقتباس ملهم..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>المؤلف</Label>
                  <Input
                    value={content.author || ''}
                    onChange={(e) => onContentChange({ ...content, author: e.target.value })}
                    placeholder="اسم المؤلف"
                  />
                </div>
                <div className="space-y-2">
                  <Label>النمط</Label>
                  <Select
                    value={content.style || 'modern'}
                    onValueChange={(value) => onContentChange({ ...content, style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">عصري</SelectItem>
                      <SelectItem value="classic">كلاسيكي</SelectItem>
                      <SelectItem value="minimal">بسيط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* رابط أفلييت */}
            {elementType === 'affiliate' && (
              <>
                <div className="space-y-2">
                  <Label>الرابط</Label>
                  <Input
                    value={content.url || ''}
                    onChange={(e) => onContentChange({ ...content, url: e.target.value })}
                    placeholder="رابط الأفلييت..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>نص الزر</Label>
                  <Input
                    value={content.text || ''}
                    onChange={(e) => onContentChange({ ...content, text: e.target.value })}
                    placeholder="اشتري الآن"
                  />
                </div>
                <div className="space-y-2">
                  <Label>معرف التتبع</Label>
                  <Input
                    value={content.trackingId || ''}
                    onChange={(e) => onContentChange({ ...content, trackingId: e.target.value })}
                    placeholder="tracking_id"
                  />
                </div>
              </>
            )}

            {/* الأيقونة */}
            {elementType === 'icon' && (
              <>
                <div className="space-y-2">
                  <Label>اسم الأيقونة</Label>
                  <Input
                    value={content.name || 'Star'}
                    onChange={(e) => onContentChange({ ...content, name: e.target.value })}
                    placeholder="Star, Heart, Check..."
                  />
                  <p className="text-xs text-muted-foreground">
                    استخدم أسماء أيقونات Lucide
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.color || '#3b82f6'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="w-10 h-8 rounded cursor-pointer border"
                    />
                    <Input
                      value={content.color || '#3b82f6'}
                      onChange={(e) => onContentChange({ ...content, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>الحجم</Label>
                    <span className="text-sm text-muted-foreground">{content.size || 48}px</span>
                  </div>
                  <Slider
                    value={[content.size || 48]}
                    min={16}
                    max={128}
                    step={4}
                    onValueChange={([value]) => onContentChange({ ...content, size: value })}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="style" className="m-0 p-4 space-y-4">
            {/* حجم الخط */}
            {(elementType === 'text' || elementType === 'heading' || elementType === 'button' || elementType === 'quote' || elementType === 'list') && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  حجم الخط
                </Label>
                <Select
                  value={style.fontSize || '16px'}
                  onValueChange={(value) => onStyleChange({ fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* وزن الخط */}
            {(elementType === 'text' || elementType === 'heading' || elementType === 'quote') && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bold className="w-4 h-4" />
                  وزن الخط
                </Label>
                <Select
                  value={style.fontWeight || '400'}
                  onValueChange={(value) => onStyleChange({ fontWeight: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* لون النص */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                لون النص
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={style.color || '#000000'}
                  onChange={(e) => onStyleChange({ color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border"
                />
                <Input
                  value={style.color || '#000000'}
                  onChange={(e) => onStyleChange({ color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            {/* لون الخلفية */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                لون الخلفية
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={style.backgroundColor || '#ffffff'}
                  onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border"
                />
                <Input
                  value={style.backgroundColor || ''}
                  onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                  className="flex-1"
                  placeholder="شفاف"
                />
              </div>
            </div>

            {/* محاذاة النص */}
            <div className="space-y-2">
              <Label>محاذاة النص</Label>
              <div className="flex gap-1">
                <Button
                  variant={style.textAlign === 'right' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onStyleChange({ textAlign: 'right' })}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button
                  variant={style.textAlign === 'center' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onStyleChange({ textAlign: 'center' })}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={style.textAlign === 'left' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onStyleChange({ textAlign: 'left' })}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* الحشو */}
            <div className="space-y-2">
              <Label>الحشو (Padding)</Label>
              <Input
                value={style.padding || ''}
                onChange={(e) => onStyleChange({ padding: e.target.value })}
                placeholder="10px 20px"
              />
            </div>

            {/* الزوايا */}
            <div className="space-y-2">
              <Label>زوايا مستديرة</Label>
              <Input
                value={style.borderRadius || ''}
                onChange={(e) => onStyleChange({ borderRadius: e.target.value })}
                placeholder="8px"
              />
            </div>
          </TabsContent>

          <TabsContent value="link" className="m-0 p-4 space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                الرابط
              </Label>
              <Input
                value={content.url || ''}
                onChange={(e) => onContentChange({ ...content, url: e.target.value })}
                placeholder="https://... أو #section-id"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <Label className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                فتح في نافذة جديدة
              </Label>
              <Switch
                checked={content.openInNewTab || false}
                onCheckedChange={(checked) => onContentChange({ ...content, openInNewTab: checked })}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted/30 space-y-1">
              <p className="text-xs font-medium">إرشادات الروابط:</p>
              <p className="text-xs text-muted-foreground">• للروابط الداخلية: #section-id</p>
              <p className="text-xs text-muted-foreground">• للصفحات: /page-name</p>
              <p className="text-xs text-muted-foreground">• للخارجية: https://...</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
