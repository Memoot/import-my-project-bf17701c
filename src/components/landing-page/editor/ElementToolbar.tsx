import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Type,
  AlignLeft,
  MousePointer,
  Image,
  Video,
  Mail,
  Minus,
  MoveVertical,
  Star,
  Clock,
  GripVertical,
} from "lucide-react";
import { ELEMENT_TYPES } from "./types";

interface ElementToolbarProps {
  onAddElement: (type: string) => void;
}

const iconMap: Record<string, any> = {
  Type,
  AlignLeft,
  MousePointer,
  Image,
  Video,
  Mail,
  Minus,
  MoveVertical,
  Star,
  Clock,
};

function DraggableElementButton({ element, onAddElement }: { element: typeof ELEMENT_TYPES[0]; onAddElement: (type: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `toolbar-${element.type}`,
    data: {
      type: 'new-element',
      elementType: element.type,
    },
  });

  const Icon = iconMap[element.icon];
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-auto py-3 w-full flex flex-col gap-1.5 text-xs hover:border-primary hover:bg-primary/5 transition-all"
        onClick={() => onAddElement(element.type)}
      >
        <div className="flex items-center gap-1">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        <span>{element.label}</span>
      </Button>
    </div>
  );
}

export function ElementToolbar({ onAddElement }: ElementToolbarProps) {
  return (
    <div className="p-3">
      <div className="mb-3">
        <h4 className="text-sm font-medium mb-1">إضافة عنصر</h4>
        <p className="text-xs text-muted-foreground">اسحب العنصر أو اضغط لإضافته</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_TYPES.map((element) => (
          <DraggableElementButton 
            key={element.type} 
            element={element} 
            onAddElement={onAddElement} 
          />
        ))}
      </div>
    </div>
  );
}
