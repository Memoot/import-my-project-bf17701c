import { LandingPageSection, LandingPage } from "@/data/landingPageTemplates";
import { DraggableSectionRenderer } from "./DraggableSectionRenderer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Layout, GripVertical } from "lucide-react";

interface DraggableLandingPageRendererProps {
  page: LandingPage;
  isEditing?: boolean;
  activeSection?: string | null;
  onSectionClick?: (sectionId: string) => void;
  onContentChange?: (sectionId: string, field: string, value: any) => void;
  onSectionsReorder?: (sections: LandingPageSection[]) => void;
  onSectionDelete?: (sectionId: string) => void;
  onSectionDuplicate?: (sectionId: string) => void;
}

export function DraggableLandingPageRenderer({ 
  page, 
  isEditing = false, 
  activeSection,
  onSectionClick,
  onContentChange,
  onSectionsReorder,
  onSectionDelete,
  onSectionDuplicate,
}: DraggableLandingPageRendererProps) {
  const [draggingSection, setDraggingSection] = useState<LandingPageSection | null>(null);

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const section = sortedSections.find(s => s.id === event.active.id);
    if (section) {
      setDraggingSection(section);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingSection(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sortedSections, oldIndex, newIndex);
        newSections.forEach((s, i) => { s.order = i + 1; });
        onSectionsReorder?.(newSections);
      }
    }
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = sortedSections.findIndex(s => s.id === sectionId);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === sortedSections.length - 1)) return;

    const newSections = [...sortedSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    newSections.forEach((s, i) => s.order = i + 1);
    onSectionsReorder?.(newSections);
  };

  if (!isEditing) {
    // Non-editing mode - simple render without drag
    return (
      <div className="font-cairo" dir={page.settings.direction}>
        {sortedSections.map(section => {
          const sectionProps = {
            content: section.content,
            settings: page.settings,
            title: section.title,
            isEditing: false,
            onContentChange: () => {},
          };
          return <div key={section.id}>{/* Render section normally */}</div>;
        })}
        
        <footer 
          className="py-6 px-6 text-center text-white text-sm"
          style={{ backgroundColor: page.settings.primaryColor }}
        >
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="font-cairo" dir={page.settings.direction}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <SortableContext
          items={sortedSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedSections.map((section, index) => (
            <DraggableSectionRenderer
              key={section.id}
              section={section}
              page={page}
              isActive={activeSection === section.id}
              isEditing={isEditing}
              onSelect={() => onSectionClick?.(section.id)}
              onDelete={() => onSectionDelete?.(section.id)}
              onDuplicate={() => onSectionDuplicate?.(section.id)}
              onMoveUp={() => handleMoveSection(section.id, 'up')}
              onMoveDown={() => handleMoveSection(section.id, 'down')}
              onContentChange={(field, value) => onContentChange?.(section.id, field, value)}
              isFirst={index === 0}
              isLast={index === sortedSections.length - 1}
            />
          ))}
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggingSection ? (
            <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-primary p-4 flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{draggingSection.title}</p>
                <p className="text-xs text-muted-foreground">اسحب لإعادة الترتيب</p>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {sortedSections.length === 0 && (
        <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg m-4">
          <div className="text-center text-muted-foreground">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">لا توجد أقسام</p>
            <p className="text-sm">أضف أقسام من اللوحة الجانبية</p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer 
        className="py-6 px-6 text-center text-white text-sm"
        style={{ backgroundColor: page.settings.primaryColor }}
      >
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
