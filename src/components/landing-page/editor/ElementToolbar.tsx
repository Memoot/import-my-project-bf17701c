import { Button } from "@/components/ui/button";
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

export function ElementToolbar({ onAddElement }: ElementToolbarProps) {
  return (
    <div className="p-3 border-b">
      <h4 className="text-sm font-medium mb-2">إضافة عنصر</h4>
      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_TYPES.map((element) => {
          const Icon = iconMap[element.icon];
          return (
            <Button
              key={element.type}
              variant="outline"
              size="sm"
              className="h-auto py-2 flex flex-col gap-1 text-xs"
              onClick={() => onAddElement(element.type)}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{element.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
