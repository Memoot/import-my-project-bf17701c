import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Type, 
  Image, 
  MousePointer, 
  Minus, 
  Square,
  GripVertical,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeHtml, sanitizeText } from "@/lib/sanitize";

interface EmailBlock {
  id: string;
  type: "heading" | "text" | "button" | "divider" | "image" | "spacer";
  content: string;
  style?: Record<string, string>;
}

interface EmailEditorProps {
  onContentChange: (blocks: EmailBlock[]) => void;
  initialBlocks?: EmailBlock[];
}

const blockTypes = [
  { type: "heading", icon: Type, label: "عنوان" },
  { type: "text", icon: Type, label: "نص" },
  { type: "button", icon: MousePointer, label: "زر" },
  { type: "divider", icon: Minus, label: "فاصل" },
  { type: "image", icon: Image, label: "صورة" },
  { type: "spacer", icon: Square, label: "مسافة" },
];

export function EmailEditor({ onContentChange, initialBlocks }: EmailEditorProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks || [
    { id: "1", type: "heading", content: "عنوان رسالتك هنا" },
    { id: "2", type: "text", content: "مرحباً،\n\nاكتب محتوى رسالتك هنا..." },
    { id: "3", type: "button", content: "اضغط هنا" },
  ]);
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addBlock = (type: EmailBlock["type"]) => {
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type,
      content: type === "heading" ? "عنوان جديد" 
        : type === "text" ? "نص جديد..."
        : type === "button" ? "زر"
        : type === "divider" ? ""
        : type === "spacer" ? ""
        : "رابط الصورة",
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onContentChange(newBlocks);
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    onContentChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    onContentChange(newBlocks);
    setSelectedBlock(null);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex(block => block.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
    onContentChange(newBlocks);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة وصف للرسالة المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: { prompt: aiPrompt, type: "custom" },
      });

      if (error) throw error;

      if (data?.content) {
        // Parse the generated content into blocks
        const lines = data.content.split("\n").filter((line: string) => line.trim());
        const newBlocks: EmailBlock[] = [];
        
        lines.forEach((line: string, index: number) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || trimmed.startsWith("**") || index === 0) {
            newBlocks.push({
              id: Date.now().toString() + index,
              type: "heading",
              content: trimmed.replace(/^[#*]+\s*/, "").replace(/\*+$/, ""),
            });
          } else if (trimmed.includes("اضغط") || trimmed.includes("سجل") || trimmed.includes("ابدأ")) {
            newBlocks.push({
              id: Date.now().toString() + index,
              type: "button",
              content: trimmed,
            });
          } else {
            newBlocks.push({
              id: Date.now().toString() + index,
              type: "text",
              content: trimmed,
            });
          }
        });

        if (newBlocks.length > 0) {
          setBlocks(newBlocks);
          onContentChange(newBlocks);
          toast({
            title: "تم توليد المحتوى بنجاح! ✨",
            description: "يمكنك تعديل المحتوى حسب رغبتك",
          });
        }
      }
    } catch (error: any) {
      console.error("Error generating email:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في توليد المحتوى",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderBlock = (block: EmailBlock) => {
    const isSelected = selectedBlock === block.id;

    return (
      <div
        key={block.id}
        className={cn(
          "relative group border-2 border-transparent rounded-lg transition-all",
          isSelected && "border-primary bg-primary/5"
        )}
        onClick={() => setSelectedBlock(block.id)}
      >
        {/* Block Controls */}
        <div className={cn(
          "absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <div className="cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Block Content */}
        <div className="p-2">
          {block.type === "heading" && (
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="text-xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
              placeholder="عنوان..."
            />
          )}
          
          {block.type === "text" && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 p-0 min-h-[60px] resize-none"
              placeholder="اكتب نصك هنا..."
            />
          )}
          
          {block.type === "button" && (
            <div className="flex items-center gap-2">
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 p-0 h-auto max-w-[200px]"
                placeholder="نص الزر..."
              />
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                {block.content || "زر"}
              </div>
            </div>
          )}
          
          {block.type === "divider" && (
            <div className="border-t border-border my-2" />
          )}
          
          {block.type === "spacer" && (
            <div className="h-8" />
          )}
          
          {block.type === "image" && (
            <div className="bg-muted rounded-lg p-8 text-center">
              <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="رابط الصورة..."
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* AI Generator */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="font-medium">توليد بالذكاء الاصطناعي</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="مثال: اكتب رسالة ترحيبية للعملاء الجدد مع عرض خصم 20%"
              className="flex-1"
            />
            <Button 
              onClick={generateWithAI}
              disabled={isGenerating}
              className="bg-primary-gradient hover:opacity-90"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 ml-2" />
                  توليد
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Block Toolbar */}
      <Card className="bg-card">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground ml-2">إضافة عنصر:</span>
            {blockTypes.map((blockType) => (
              <Button
                key={blockType.type}
                variant="outline"
                size="sm"
                onClick={() => addBlock(blockType.type as EmailBlock["type"])}
                className="gap-1"
              >
                <blockType.icon className="w-3 h-3" />
                {blockType.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor Canvas */}
      <Card className="bg-card min-h-[400px]">
        <CardContent className="p-6 pr-16">
          <div className="space-y-2">
            {blocks.map(renderBlock)}
          </div>
          
          {blocks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ابدأ بإضافة عناصر من شريط الأدوات أعلاه</p>
              <p className="text-sm">أو استخدم الذكاء الاصطناعي لتوليد محتوى</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function blocksToHtml(blocks: EmailBlock[]): string {
  const html = blocks.map(block => {
    // Sanitize content to prevent XSS
    const safeContent = sanitizeText(block.content);
    
    switch (block.type) {
      case "heading":
        return `<h1 style="color: #1e40af; font-size: 24px; font-weight: bold; margin: 0 0 16px; font-family: 'Cairo', Arial, sans-serif;">${safeContent}</h1>`;
      case "text":
        return `<p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 16px; font-family: 'Cairo', Arial, sans-serif;">${safeContent.replace(/\n/g, '<br>')}</p>`;
      case "button":
        return `<div style="text-align: center; margin: 24px 0;"><a href="#" style="background: linear-gradient(135deg, #1e40af, #1e3a8a); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-family: 'Cairo', Arial, sans-serif;">${safeContent}</a></div>`;
      case "divider":
        return `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">`;
      case "spacer":
        return `<div style="height: 32px;"></div>`;
      case "image":
        // Sanitize URL to prevent javascript: protocol
        const safeUrl = block.content.startsWith('http') ? sanitizeText(block.content) : '';
        return safeUrl ? `<div style="text-align: center; margin: 24px 0;"><img src="${safeUrl}" style="max-width: 100%; border-radius: 8px;" alt="صورة"></div>` : "";
      default:
        return "";
    }
  }).join("\n");
  
  // Final sanitization pass
  return sanitizeHtml(html);
}

export function blocksToText(blocks: EmailBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case "heading":
      case "text":
      case "button":
        return block.content;
      case "divider":
        return "---";
      case "spacer":
        return "";
      default:
        return "";
    }
  }).filter(Boolean).join("\n\n");
}
