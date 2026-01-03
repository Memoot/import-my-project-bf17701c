import { Image as ImageIcon } from "lucide-react";

interface GallerySectionProps {
  content: {
    images?: string[];
    categories?: string[];
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function GallerySection({ content, settings, title }: GallerySectionProps) {
  const images = content.images || [];
  
  // Placeholder images if none provided
  const displayImages = images.length > 0 ? images : [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{title || 'معرض الصور'}</h2>
        {content.categories && content.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button 
              className="px-4 py-2 rounded-full text-white text-sm"
              style={{ backgroundColor: settings.primaryColor }}
            >
              الكل
            </button>
            {content.categories.map((cat, i) => (
              <button 
                key={i}
                className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-gray-100 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((img, i) => (
            <div 
              key={i} 
              className="aspect-square bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
            >
              {typeof img === 'string' && img.startsWith('http') ? (
                <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">صورة {i + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
