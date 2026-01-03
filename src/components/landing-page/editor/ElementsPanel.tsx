import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Type,
  AlignLeft,
  MousePointer,
  Image,
  Play,
  Mail,
  Minus,
  MoveVertical,
  Star,
  Clock,
  GripVertical,
  Images,
  MapPin,
  Share2,
  Code,
  Shapes,
  List,
  Quote,
  Link,
  Sparkles,
  LayoutGrid,
  Search,
  Plus,
} from "lucide-react";
import { ELEMENT_CATEGORIES, ElementType } from "./types";

interface ElementsPanelProps {
  onAddElement: (type: string) => void;
}

const iconMap: Record<string, any> = {
  Type,
  AlignLeft,
  MousePointer,
  Image,
  Play,
  Video: Play,
  Mail,
  Minus,
  MoveVertical,
  Star,
  Clock,
  Images,
  MapPin,
  Share2,
  Code,
  Shapes,
  List,
  Quote,
  Link,
  Sparkles,
  LayoutGrid,
};

function DraggableElement({ 
  element, 
  onAddElement,
  compact = false 
}: { 
  element: ElementType; 
  onAddElement: (type: string) => void;
  compact?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `toolbar-${element.type}`,
    data: {
      type: 'new-element',
      elementType: element.type,
    },
  });

  const Icon = iconMap[element.icon] || Star;
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-2 w-full flex flex-col items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
          onClick={() => onAddElement(element.type)}
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-muted-foreground">{element.label}</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <div
        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
        onClick={() => onAddElement(element.type)}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{element.label}</p>
          {element.description && (
            <p className="text-xs text-muted-foreground truncate">{element.description}</p>
          )}
        </div>
        <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

export function ElementsPanel({ onAddElement }: ElementsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter elements based on search
  const filteredCategories = ELEMENT_CATEGORIES.map(cat => ({
    ...cat,
    elements: cat.elements.filter(el => 
      el.label.includes(searchTerm) || 
      el.description?.includes(searchTerm) ||
      el.type.includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.elements.length > 0);

  const allElements = ELEMENT_CATEGORIES.flatMap(cat => cat.elements).filter(el =>
    el.label.includes(searchTerm) || 
    el.description?.includes(searchTerm) ||
    el.type.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-b from-muted/50 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">إضافة عنصر</h3>
            <p className="text-xs text-muted-foreground">اسحب وأفلت في الصفحة</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن عنصر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9 h-9 text-sm bg-background"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <div className="px-2 py-2 border-b overflow-x-auto">
            <TabsList className="h-8 p-0.5 bg-muted/50 w-full justify-start gap-0.5">
              <TabsTrigger 
                value="all" 
                className="h-7 px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                الكل
              </TabsTrigger>
              {ELEMENT_CATEGORIES.map(cat => {
                const CatIcon = iconMap[cat.icon] || Star;
                return (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="h-7 px-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1"
                  >
                    <CatIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            {/* All Elements */}
            <TabsContent value="all" className="m-0 p-3">
              {searchTerm ? (
                <div className="grid grid-cols-3 gap-2">
                  {allElements.map((element) => (
                    <DraggableElement 
                      key={element.type} 
                      element={element} 
                      onAddElement={onAddElement}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {ELEMENT_CATEGORIES.map(cat => {
                    const CatIcon = iconMap[cat.icon] || Star;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center gap-2 mb-2">
                          <CatIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">{cat.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {cat.elements.map((element) => (
                            <DraggableElement 
                              key={element.type} 
                              element={element} 
                              onAddElement={onAddElement}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Category-specific content */}
            {ELEMENT_CATEGORIES.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="m-0 p-3">
                <div className="space-y-2">
                  {cat.elements
                    .filter(el => 
                      !searchTerm || 
                      el.label.includes(searchTerm) || 
                      el.description?.includes(searchTerm)
                    )
                    .map((element) => (
                      <DraggableElement 
                        key={element.type} 
                        element={element} 
                        onAddElement={onAddElement}
                      />
                    ))
                  }
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
