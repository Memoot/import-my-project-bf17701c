// أنواع محرر صفحات الهبوط

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
}

export interface ButtonSettings {
  text: string;
  url: string;
  openInNewTab: boolean;
  style: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
}

export interface ImageElement {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface VideoElement {
  url: string;
  type: 'youtube' | 'vimeo' | 'direct';
  autoplay?: boolean;
  controls?: boolean;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // للـ select
}

export interface FormElement {
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
}

export interface DraggableElement {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'video' | 'form' | 'divider' | 'spacer' | 'icon' | 'countdown' | 'gallery' | 'map' | 'social' | 'embed' | 'shape' | 'list' | 'quote' | 'affiliate';
  content: any;
  style: ElementStyle;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  locked?: boolean;
  visible?: boolean;
  layer?: number;
}

export interface SectionSettings {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  minHeight?: number;
}

export interface PageType {
  value: 'sales' | 'thankyou' | 'optin' | 'webinar' | 'checkout' | 'privacy' | 'custom';
  label: string;
  icon: string;
}

export const PAGE_TYPES: PageType[] = [
  { value: 'sales', label: 'صفحة بيع', icon: 'DollarSign' },
  { value: 'thankyou', label: 'صفحة شكر', icon: 'Heart' },
  { value: 'optin', label: 'صفحة تسجيل', icon: 'Mail' },
  { value: 'webinar', label: 'صفحة ويبينار', icon: 'Video' },
  { value: 'checkout', label: 'صفحة الدفع', icon: 'CreditCard' },
  { value: 'privacy', label: 'سياسة الخصوصية', icon: 'Shield' },
  { value: 'custom', label: 'صفحة مخصصة', icon: 'FileText' },
];

// Element categories for organized toolbar like Hostinger
export interface ElementCategory {
  id: string;
  label: string;
  icon: string;
  elements: ElementType[];
}

export interface ElementType {
  type: string;
  label: string;
  icon: string;
  description?: string;
}

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    id: 'basic',
    label: 'أساسي',
    icon: 'Type',
    elements: [
      { type: 'heading', label: 'عنوان', icon: 'Type', description: 'أضف عنوان رئيسي أو فرعي' },
      { type: 'text', label: 'نص', icon: 'AlignLeft', description: 'فقرة نصية قابلة للتحرير' },
      { type: 'button', label: 'زر', icon: 'MousePointer', description: 'زر دعوة للإجراء' },
      { type: 'list', label: 'قائمة', icon: 'List', description: 'قائمة منقطة أو مرقمة' },
      { type: 'quote', label: 'اقتباس', icon: 'Quote', description: 'نص اقتباس مميز' },
    ]
  },
  {
    id: 'media',
    label: 'وسائط',
    icon: 'Image',
    elements: [
      { type: 'image', label: 'صورة', icon: 'Image', description: 'صورة من جهازك أو رابط' },
      { type: 'video', label: 'فيديو', icon: 'Play', description: 'فيديو يوتيوب أو مباشر' },
      { type: 'gallery', label: 'معرض صور', icon: 'Images', description: 'معرض صور متعددة' },
      { type: 'icon', label: 'أيقونة', icon: 'Star', description: 'أيقونات متنوعة' },
      { type: 'shape', label: 'شكل', icon: 'Shapes', description: 'أشكال هندسية وزخارف' },
    ]
  },
  {
    id: 'interactive',
    label: 'تفاعلي',
    icon: 'Sparkles',
    elements: [
      { type: 'form', label: 'نموذج اشتراك', icon: 'Mail', description: 'نموذج لجمع البريد' },
      { type: 'countdown', label: 'عداد تنازلي', icon: 'Clock', description: 'عد تنازلي للعروض' },
      { type: 'map', label: 'خريطة', icon: 'MapPin', description: 'خريطة Google Maps' },
      { type: 'affiliate', label: 'رابط أفلييت', icon: 'Link', description: 'روابط التسويق بالعمولة' },
    ]
  },
  {
    id: 'social',
    label: 'تواصل',
    icon: 'Share2',
    elements: [
      { type: 'social', label: 'أيقونات التواصل', icon: 'Share2', description: 'روابط السوشيال ميديا' },
      { type: 'embed', label: 'كود مضمن', icon: 'Code', description: 'HTML أو كود مخصص' },
    ]
  },
  {
    id: 'layout',
    label: 'تخطيط',
    icon: 'LayoutGrid',
    elements: [
      { type: 'divider', label: 'فاصل', icon: 'Minus', description: 'خط فاصل أفقي' },
      { type: 'spacer', label: 'مسافة', icon: 'MoveVertical', description: 'مسافة فارغة' },
    ]
  },
];

// Flat list for backward compatibility
export const ELEMENT_TYPES = ELEMENT_CATEGORIES.flatMap(cat => cat.elements);

export const FONT_SIZES = [
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
  { value: '36px', label: '36' },
  { value: '40px', label: '40' },
  { value: '48px', label: '48' },
  { value: '56px', label: '56' },
  { value: '64px', label: '64' },
  { value: '72px', label: '72' },
];

export const FONT_WEIGHTS = [
  { value: '300', label: 'خفيف' },
  { value: '400', label: 'عادي' },
  { value: '500', label: 'متوسط' },
  { value: '600', label: 'نصف سميك' },
  { value: '700', label: 'سميك' },
  { value: '800', label: 'سميك جداً' },
];
