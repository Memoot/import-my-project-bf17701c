import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";
import { ElementStyle, ButtonSettings, FONT_SIZES, FONT_WEIGHTS } from "./types";

interface StyleEditorProps {
  elementType: string;
  style: ElementStyle;
  content: any;
  onStyleChange: (style: Partial<ElementStyle>) => void;
  onContentChange: (content: any) => void;
}

export function StyleEditor({
  elementType,
  style,
  content,
  onStyleChange,
  onContentChange,
}: StyleEditorProps) {
  return (
    <div className="space-y-4 p-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="style">التنسيق</TabsTrigger>
          <TabsTrigger value="link">الروابط</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* محتوى النص والعنوان */}
          {(elementType === 'text' || elementType === 'heading') && (
            <div className="space-y-2">
              <Label>النص</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => onContentChange({ ...content, text: e.target.value })}
                placeholder="أدخل النص..."
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
                    <SelectItem value="ghost">شفاف</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex items-center justify-between">
                <Label>تشغيل تلقائي</Label>
                <Switch
                  checked={content.autoplay || false}
                  onCheckedChange={(checked) => onContentChange({ ...content, autoplay: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
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
            <div className="space-y-2">
              <Label>الارتفاع: {content.height || 40}px</Label>
              <Slider
                value={[content.height || 40]}
                min={10}
                max={200}
                step={10}
                onValueChange={([value]) => onContentChange({ ...content, height: value })}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          {/* حجم الخط */}
          {(elementType === 'text' || elementType === 'heading' || elementType === 'button') && (
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
          {(elementType === 'text' || elementType === 'heading') && (
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
                onClick={() => onStyleChange({ textAlign: 'right' })}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <Button
                variant={style.textAlign === 'center' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onStyleChange({ textAlign: 'center' })}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={style.textAlign === 'left' ? 'secondary' : 'outline'}
                size="sm"
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

        <TabsContent value="link" className="space-y-4 mt-4">
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

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              فتح في نافذة جديدة
            </Label>
            <Switch
              checked={content.openInNewTab || false}
              onCheckedChange={(checked) => onContentChange({ ...content, openInNewTab: checked })}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• للروابط الداخلية: استخدم #section-id</p>
            <p>• للصفحات الأخرى: استخدم /page-name</p>
            <p>• للروابط الخارجية: استخدم https://...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
