import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical, Mail, Phone, Type, AlignLeft, CheckSquare, List } from "lucide-react";
import { FormField, FormElement } from "./types";
import { cn } from "@/lib/utils";

interface FormBuilderProps {
  form: FormElement;
  onChange: (form: FormElement) => void;
}

const fieldTypeIcons: Record<string, any> = {
  text: Type,
  email: Mail,
  phone: Phone,
  textarea: AlignLeft,
  select: List,
  checkbox: CheckSquare,
};

const fieldTypeLabels: Record<string, string> = {
  text: 'نص',
  email: 'بريد إلكتروني',
  phone: 'هاتف',
  textarea: 'نص طويل',
  select: 'قائمة اختيار',
  checkbox: 'خيار تحديد',
};

export function FormBuilder({ form, onChange }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showAddField, setShowAddField] = useState(false);

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: fieldTypeLabels[type] || 'حقل جديد',
      placeholder: '',
      required: false,
      options: type === 'select' ? ['خيار 1', 'خيار 2', 'خيار 3'] : undefined,
    };
    onChange({
      ...form,
      fields: [...form.fields, newField],
    });
    setShowAddField(false);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    onChange({
      ...form,
      fields: form.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const handleDeleteField = (fieldId: string) => {
    onChange({
      ...form,
      fields: form.fields.filter((f) => f.id !== fieldId),
    });
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = form.fields.findIndex((f) => f.id === fieldId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === form.fields.length - 1)
    ) {
      return;
    }

    const newFields = [...form.fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    onChange({ ...form, fields: newFields });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>حقول النموذج</Label>
        <div className="space-y-2">
          {form.fields.map((field, index) => {
            const Icon = fieldTypeIcons[field.type] || Type;
            return (
              <div
                key={field.id}
                className="flex items-center gap-2 p-2 border rounded-lg bg-card"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <Icon className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{field.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {fieldTypeLabels[field.type]}
                    {field.required && ' • مطلوب'}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField(field)}
                    >
                      تعديل
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تعديل الحقل</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>اسم الحقل</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            handleUpdateField(field.id, { label: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>النص التوضيحي</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) =>
                            handleUpdateField(field.id, { placeholder: e.target.value })
                          }
                          placeholder="أدخل نص توضيحي..."
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>حقل مطلوب</Label>
                        <Switch
                          checked={field.required || false}
                          onCheckedChange={(checked) =>
                            handleUpdateField(field.id, { required: checked })
                          }
                        />
                      </div>
                      {field.type === 'select' && (
                        <div className="space-y-2">
                          <Label>الخيارات (سطر لكل خيار)</Label>
                          <textarea
                            className="w-full h-24 p-2 border rounded-lg text-sm"
                            value={field.options?.join('\n') || ''}
                            onChange={(e) =>
                              handleUpdateField(field.id, {
                                options: e.target.value.split('\n').filter(Boolean),
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* إضافة حقل جديد */}
        <Dialog open={showAddField} onOpenChange={setShowAddField}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 ml-2" />
              إضافة حقل
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>اختر نوع الحقل</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 pt-4">
              {Object.entries(fieldTypeLabels).map(([type, label]) => {
                const Icon = fieldTypeIcons[type];
                return (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => handleAddField(type as FormField['type'])}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                    <span>{label}</span>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label>نص زر الإرسال</Label>
          <Input
            value={form.submitButtonText || 'إرسال'}
            onChange={(e) => onChange({ ...form, submitButtonText: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>رسالة النجاح</Label>
          <Input
            value={form.successMessage || 'تم الإرسال بنجاح!'}
            onChange={(e) => onChange({ ...form, successMessage: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>رابط إعادة التوجيه (اختياري)</Label>
          <Input
            value={form.redirectUrl || ''}
            onChange={(e) => onChange({ ...form, redirectUrl: e.target.value })}
            placeholder="/thank-you"
          />
        </div>
      </div>
    </div>
  );
}
