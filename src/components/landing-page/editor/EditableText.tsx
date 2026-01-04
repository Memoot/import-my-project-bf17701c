import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  style?: React.CSSProperties;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  isEditing,
  className,
  placeholder = "انقر للتحرير...",
  as: Tag = 'p',
  style,
  multiline = false,
}: EditableTextProps) {
  const [isActive, setIsActive] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive]);

  const handleBlur = () => {
    setIsActive(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsActive(false);
    }
  };

  if (!isEditing) {
    return (
      <Tag className={className} style={style}>
        {value || placeholder}
      </Tag>
    );
  }

  if (isActive) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-transparent border-2 border-primary/50 rounded px-2 py-1 focus:outline-none focus:border-primary",
          "w-full min-w-[100px]",
          multiline && "resize-none min-h-[60px]",
          className
        )}
        style={style}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <Tag
      className={cn(
        className,
        "cursor-text hover:bg-primary/10 hover:outline hover:outline-2 hover:outline-dashed hover:outline-primary/50 rounded transition-all"
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setIsActive(true);
      }}
      title="انقر للتحرير"
    >
      {value || <span className="opacity-50">{placeholder}</span>}
    </Tag>
  );
}
