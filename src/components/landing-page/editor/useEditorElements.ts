import { useState, useCallback } from "react";
import { DraggableElement, ElementStyle } from "./types";

export function useEditorElements(initialElements: DraggableElement[] = []) {
  const [elements, setElements] = useState<DraggableElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const addElement = useCallback((type: string) => {
    const newElement: DraggableElement = {
      id: `element-${Date.now()}`,
      type: type as DraggableElement['type'],
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      visible: true,
      locked: false,
      layer: elements.length + 1,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, [elements.length]);

  const updateElement = useCallback((id: string, updates: Partial<DraggableElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const updateElementStyle = useCallback((id: string, style: Partial<ElementStyle>) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, style: { ...el.style, ...style } } : el
      )
    );
  }, []);

  const updateElementContent = useCallback((id: string, content: any) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, content: { ...el.content, ...content } } : el
      )
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const newElement: DraggableElement = {
      ...element,
      id: `element-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
      layer: elements.length + 1,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, [elements]);

  const toggleVisibility = useCallback((id: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el
      )
    );
  }, []);

  const reorderElements = useCallback((newElements: DraggableElement[]) => {
    setElements(newElements);
  }, []);

  const moveLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setElements((prev) => {
      const sorted = [...prev].sort((a, b) => (a.layer || 0) - (b.layer || 0));
      const index = sorted.findIndex((el) => el.id === id);
      
      if (
        (direction === 'up' && index === sorted.length - 1) ||
        (direction === 'down' && index === 0)
      ) {
        return prev;
      }

      const newIndex = direction === 'up' ? index + 1 : index - 1;
      [sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]];
      
      return sorted.map((el, i) => ({ ...el, layer: i + 1 }));
    });
  }, []);

  return {
    elements,
    setElements,
    selectedElementId,
    selectedElement,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementStyle,
    updateElementContent,
    deleteElement,
    duplicateElement,
    toggleVisibility,
    toggleLock,
    reorderElements,
    moveLayer,
  };
}

function getDefaultContent(type: string): any {
  switch (type) {
    case 'heading':
      return { text: 'عنوان جديد' };
    case 'text':
      return { text: 'أضف نص هنا...' };
    case 'button':
      return { text: 'زر جديد', url: '#', openInNewTab: false, variant: 'primary', size: 'md' };
    case 'image':
      return { src: '', alt: 'صورة' };
    case 'video':
      return { url: '', autoplay: false, controls: true };
    case 'form':
      return {
        fields: [
          { id: 'name', type: 'text', label: 'الاسم', required: true },
          { id: 'email', type: 'email', label: 'البريد الإلكتروني', required: true },
        ],
        submitButtonText: 'إرسال',
        successMessage: 'تم الإرسال بنجاح!',
      };
    case 'countdown':
      return { endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() };
    case 'spacer':
      return { height: 40 };
    case 'divider':
      return { style: 'solid' };
    case 'icon':
      return { name: 'Star', size: 48 };
    default:
      return {};
  }
}

function getDefaultStyle(type: string): ElementStyle {
  switch (type) {
    case 'heading':
      return {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
      };
    case 'text':
      return {
        fontSize: '16px',
        fontWeight: '400',
        color: '#4b5563',
        textAlign: 'center',
      };
    case 'button':
      return {
        fontSize: '16px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '8px',
      };
    default:
      return {};
  }
}
