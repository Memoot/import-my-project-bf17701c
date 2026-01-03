import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Type,
  Image,
  Video,
  MousePointer,
  Mail,
  Minus,
  MoveVertical,
  Star,
  Clock,
  AlignLeft,
} from "lucide-react";
import { DraggableElement } from "./types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LayersPanelProps {
  elements: DraggableElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorderElements: (elements: DraggableElement[]) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

const iconMap: Record<string, any> = {
  heading: Type,
  text: AlignLeft,
  button: MousePointer,
  image: Image,
  video: Video,
  form: Mail,
  divider: Minus,
  spacer: MoveVertical,
  icon: Star,
  countdown: Clock,
};

function SortableLayerItem({
  element,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  element: DraggableElement;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = iconMap[element.type] || Type;
  const isVisible = element.visible !== false;
  const isLocked = element.locked === true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 p-2 rounded-lg border transition-colors group",
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        !isVisible && "opacity-50"
      )}
      onClick={onSelect}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </button>

      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      
      <span className="text-xs flex-1 truncate">
        {element.content?.text?.slice(0, 20) || element.type}
      </span>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        >
          {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
        >
          {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onDuplicateElement,
  onToggleVisibility,
  onToggleLock,
  onReorderElements,
  onMoveLayer,
}: LayersPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);
      const newElements = arrayMove(elements, oldIndex, newIndex);
      // تحديث الطبقات
      newElements.forEach((el, i) => {
        el.layer = newElements.length - i;
      });
      onReorderElements(newElements);
    }
  };

  // عكس الترتيب للعرض (الطبقة العليا أولاً)
  const sortedElements = [...elements].sort((a, b) => (b.layer || 0) - (a.layer || 0));

  return (
    <div className="p-3">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Star className="w-4 h-4" />
        الطبقات
      </h4>
      
      {elements.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-xs">لا توجد عناصر</p>
          <p className="text-xs">أضف عناصر من القائمة أعلاه</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedElements.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sortedElements.map((element, index) => (
                <SortableLayerItem
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => onSelectElement(element.id)}
                  onDelete={() => onDeleteElement(element.id)}
                  onDuplicate={() => onDuplicateElement(element.id)}
                  onToggleVisibility={() => onToggleVisibility(element.id)}
                  onToggleLock={() => onToggleLock(element.id)}
                  onMoveUp={() => onMoveLayer(element.id, 'up')}
                  onMoveDown={() => onMoveLayer(element.id, 'down')}
                  isFirst={index === 0}
                  isLast={index === sortedElements.length - 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
