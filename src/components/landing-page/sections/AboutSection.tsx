import { Award, Users, Clock, Plus, Trash2 } from "lucide-react";
import { EditableText } from "../editor/EditableText";
import { Button } from "@/components/ui/button";

interface AboutSectionProps {
  content: {
    name?: string;
    bio?: string;
    achievements?: string[];
    image?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function AboutSection({ content, settings, title, isEditing, onContentChange }: AboutSectionProps) {
  const addAchievement = () => {
    const newAchievements = [...(content.achievements || []), 'إنجاز جديد'];
    onContentChange?.('achievements', newAchievements);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...(content.achievements || [])];
    newAchievements[index] = value;
    onContentChange?.('achievements', newAchievements);
  };

  const deleteAchievement = (index: number) => {
    const newAchievements = (content.achievements || []).filter((_, i) => i !== index);
    onContentChange?.('achievements', newAchievements);
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <EditableText
          value={title || 'من نحن'}
          onChange={(value) => onContentChange?.('title', value)}
          isEditing={!!isEditing}
          as="h2"
          className="text-3xl font-bold text-center mb-12"
          placeholder="أدخل العنوان..."
        />
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div 
            className="w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {(content.name || 'اسم').charAt(0)}
          </div>
          <div className="text-center md:text-right flex-1">
            <EditableText
              value={content.name || 'اسم المؤسس'}
              onChange={(value) => onContentChange?.('name', value)}
              isEditing={!!isEditing}
              as="h3"
              className="text-2xl font-bold mb-2"
              placeholder="الاسم..."
            />
            <EditableText
              value={content.bio || 'وصف مختصر عن الشخص أو المؤسسة'}
              onChange={(value) => onContentChange?.('bio', value)}
              isEditing={!!isEditing}
              as="p"
              className="text-gray-600 mb-6"
              placeholder="السيرة الذاتية..."
              multiline
            />
            {content.achievements && content.achievements.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {content.achievements.map((achievement, i) => (
                  <div 
                    key={i} 
                    className="relative px-4 py-2 rounded-full text-sm font-medium group/ach"
                    style={{ 
                      backgroundColor: `${settings.primaryColor}15`,
                      color: settings.primaryColor
                    }}
                  >
                    ✓{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(i, e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-24"
                        placeholder="إنجاز"
                      />
                    ) : (
                      achievement
                    )}
                    {isEditing && (
                      <button
                        onClick={() => deleteAchievement(i)}
                        className="absolute -top-1 -left-1 p-0.5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover/ach:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isEditing && (
              <Button variant="outline" size="sm" className="mt-4" onClick={addAchievement}>
                <Plus className="w-3 h-3 ml-1" />
                إضافة إنجاز
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
