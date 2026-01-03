import { Play } from "lucide-react";

interface VideoSectionProps {
  content: {
    videoUrl?: string;
    thumbnail?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
}

export function VideoSection({ content, settings, title }: VideoSectionProps) {
  const getEmbedUrl = (url: string) => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{title || 'شاهد الفيديو'}</h2>
        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {content.videoUrl ? (
            <iframe
              src={getEmbedUrl(content.videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <Play className="w-10 h-10 fill-white" />
                </div>
                <p className="text-gray-400">أضف رابط الفيديو لعرضه هنا</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
