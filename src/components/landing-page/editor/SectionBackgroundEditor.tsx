import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Palette, Layers } from "lucide-react";
import { SectionSettings } from "./types";

interface SectionBackgroundEditorProps {
  settings: SectionSettings;
  onChange: (settings: Partial<SectionSettings>) => void;
}

const gradientPresets = [
  { name: 'أزرق', value: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' },
  { name: 'بنفسجي', value: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' },
  { name: 'أخضر', value: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
  { name: 'برتقالي', value: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' },
  { name: 'أحمر', value: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
  { name: 'رمادي', value: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)' },
  { name: 'ذهبي', value: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)' },
  { name: 'سماوي', value: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)' },
];

export function SectionBackgroundEditor({ settings, onChange }: SectionBackgroundEditorProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="color" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="color">لون</TabsTrigger>
          <TabsTrigger value="gradient">تدرج</TabsTrigger>
          <TabsTrigger value="image">صورة</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              لون الخلفية
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.backgroundColor || '#ffffff'}
                onChange={(e) => onChange({ backgroundColor: e.target.value, backgroundImage: undefined })}
                className="w-10 h-10 rounded cursor-pointer border"
              />
              <Input
                value={settings.backgroundColor || '#ffffff'}
                onChange={(e) => onChange({ backgroundColor: e.target.value, backgroundImage: undefined })}
                className="flex-1"
              />
            </div>
          </div>

          {/* ألوان سريعة */}
          <div className="space-y-2">
            <Label>ألوان سريعة</Label>
            <div className="flex flex-wrap gap-2">
              {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#1e293b', '#0f172a', '#000000'].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ backgroundColor: color, backgroundImage: undefined })}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>تدرجات جاهزة</Label>
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  className="h-12 rounded border-2 border-border hover:scale-105 transition-transform"
                  style={{ background: preset.value }}
                  onClick={() => onChange({ backgroundImage: preset.value, backgroundColor: undefined })}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>تدرج مخصص</Label>
            <Input
              value={settings.backgroundImage || ''}
              onChange={(e) => onChange({ backgroundImage: e.target.value, backgroundColor: undefined })}
              placeholder="linear-gradient(135deg, #color1 0%, #color2 100%)"
            />
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              رابط الصورة
            </Label>
            <Input
              value={settings.backgroundImage?.startsWith('url(') ? settings.backgroundImage.slice(4, -1) : ''}
              onChange={(e) => onChange({ backgroundImage: e.target.value ? `url(${e.target.value})` : undefined })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              طبقة التعتيم
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.backgroundOverlay || '#000000'}
                onChange={(e) => onChange({ backgroundOverlay: e.target.value })}
                className="w-10 h-8 rounded cursor-pointer border"
              />
              <Select
                value={settings.backgroundOverlay?.split(',').pop()?.trim() || '0.5'}
                onValueChange={(value) => {
                  const color = settings.backgroundOverlay?.split(',').slice(0, 3).join(',') || 'rgba(0,0,0';
                  onChange({ backgroundOverlay: `${color}, ${value})` });
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="شفافية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">10%</SelectItem>
                  <SelectItem value="0.2">20%</SelectItem>
                  <SelectItem value="0.3">30%</SelectItem>
                  <SelectItem value="0.4">40%</SelectItem>
                  <SelectItem value="0.5">50%</SelectItem>
                  <SelectItem value="0.6">60%</SelectItem>
                  <SelectItem value="0.7">70%</SelectItem>
                  <SelectItem value="0.8">80%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* الحشو */}
      <div className="space-y-3 pt-4 border-t">
        <Label>الحشو (Padding)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">أعلى</Label>
            <Input
              type="number"
              value={settings.padding?.top || 60}
              onChange={(e) => onChange({ 
                padding: { ...settings.padding, top: parseInt(e.target.value) || 0 } as any 
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">أسفل</Label>
            <Input
              type="number"
              value={settings.padding?.bottom || 60}
              onChange={(e) => onChange({ 
                padding: { ...settings.padding, bottom: parseInt(e.target.value) || 0 } as any 
              })}
            />
          </div>
        </div>
      </div>

      {/* الارتفاع الأدنى */}
      <div className="space-y-2">
        <Label>الارتفاع الأدنى: {settings.minHeight || 400}px</Label>
        <Slider
          value={[settings.minHeight || 400]}
          min={200}
          max={1000}
          step={50}
          onValueChange={([value]) => onChange({ minHeight: value })}
        />
      </div>
    </div>
  );
}
