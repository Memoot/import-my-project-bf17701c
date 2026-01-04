import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";

interface EditableButtonProps {
  text: string;
  url?: string;
  onTextChange: (text: string) => void;
  onUrlChange?: (url: string) => void;
  isEditing: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableButton({
  text,
  url,
  onTextChange,
  onUrlChange,
  isEditing,
  className,
  style,
  children,
}: EditableButtonProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [showUrlPopover, setShowUrlPopover] = useState(false);
  const [localUrl, setLocalUrl] = useState(url || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    setLocalUrl(url || '');
  }, [url]);

  useEffect(() => {
    if (isEditingText && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingText]);

  const handleTextBlur = () => {
    setIsEditingText(false);
    if (localText !== text) {
      onTextChange(localText);
    }
  };

  const handleUrlSave = () => {
    if (localUrl !== url && onUrlChange) {
      onUrlChange(localUrl);
    }
    setShowUrlPopover(false);
  };

  if (!isEditing) {
    return (
      <Button className={className} style={style}>
        {children || text}
      </Button>
    );
  }

  if (isEditingText) {
    return (
      <input
        ref={inputRef}
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleTextBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleTextBlur();
          }
          if (e.key === 'Escape') {
            setLocalText(text);
            setIsEditingText(false);
          }
        }}
        className={cn(
          "bg-transparent border-2 border-primary rounded px-4 py-2 text-center focus:outline-none focus:border-primary",
          className
        )}
        style={style}
      />
    );
  }

  return (
    <div className="inline-flex items-center gap-1 group/btn">
      <Button
        className={cn(
          className,
          "hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-text"
        )}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsEditingText(true);
        }}
        title="انقر لتحرير النص"
      >
        {children || text}
      </Button>
      
      {onUrlChange && (
        <Popover open={showUrlPopover} onOpenChange={setShowUrlPopover}>
          <PopoverTrigger asChild>
            <button
              className="p-1 rounded bg-primary/20 hover:bg-primary/40 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              title="تحرير الرابط"
            >
              <Link className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <Label>رابط الزر</Label>
              <Input
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder="https://... أو #section"
                dir="ltr"
              />
              <Button size="sm" onClick={handleUrlSave}>
                حفظ
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
