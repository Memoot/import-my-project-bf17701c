

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

interface BlogSectionProps {
  content: {
    title?: string;
    subtitle?: string;
    posts?: BlogPost[];
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
  };
  title?: string;
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
}

export function BlogSection({ content, settings, isEditing, onContentChange }: BlogSectionProps) {
  const posts = content.posts || [];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {isEditing ? (
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => onContentChange?.("title", e.target.value)}
              className="text-3xl md:text-4xl font-bold mb-4 bg-transparent border-b-2 border-dashed border-gray-400 text-center w-full"
              style={{ color: settings.primaryColor }}
              placeholder="عنوان القسم"
            />
          ) : (
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: settings.primaryColor }}
            >
              {content.title}
            </h2>
          )}
          
          {isEditing ? (
            <textarea
              value={content.subtitle || ""}
              onChange={(e) => onContentChange?.("subtitle", e.target.value)}
              className="text-lg text-gray-600 bg-transparent border-b-2 border-dashed border-gray-400 text-center w-full resize-none"
              placeholder="وصف القسم"
              rows={2}
            />
          ) : (
            <p className="text-lg text-gray-600">{content.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden">
                {isEditing ? (
                  <input
                    type="text"
                    value={post.image}
                    onChange={(e) => {
                      const newPosts = [...posts];
                      newPosts[index] = { ...post, image: e.target.value };
                      onContentChange?.("posts", newPosts);
                    }}
                    className="w-full h-full p-4 text-sm bg-gray-100"
                    placeholder="رابط الصورة"
                  />
                ) : (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={post.category}
                        onChange={(e) => {
                          const newPosts = [...posts];
                          newPosts[index] = { ...post, category: e.target.value };
                          onContentChange?.("posts", newPosts);
                        }}
                        className="bg-transparent border-b border-dashed border-gray-300 w-20"
                        placeholder="التصنيف"
                      />
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => {
                          const newPosts = [...posts];
                          newPosts[index] = { ...post, date: e.target.value };
                          onContentChange?.("posts", newPosts);
                        }}
                        className="bg-transparent border-b border-dashed border-gray-300 w-24"
                        placeholder="التاريخ"
                      />
                    </>
                  ) : (
                    <>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${settings.primaryColor}20`, color: settings.primaryColor }}
                      >
                        {post.category}
                      </span>
                      <span>{post.date}</span>
                    </>
                  )}
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => {
                      const newPosts = [...posts];
                      newPosts[index] = { ...post, title: e.target.value };
                      onContentChange?.("posts", newPosts);
                    }}
                    className="text-xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-gray-400 w-full"
                    style={{ color: settings.primaryColor }}
                    placeholder="عنوان المقالة"
                  />
                ) : (
                  <h3 
                    className="text-xl font-bold mb-2 hover:opacity-80 cursor-pointer transition-opacity"
                    style={{ color: settings.primaryColor }}
                  >
                    {post.title}
                  </h3>
                )}
                
                {isEditing ? (
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => {
                      const newPosts = [...posts];
                      newPosts[index] = { ...post, excerpt: e.target.value };
                      onContentChange?.("posts", newPosts);
                    }}
                    className="text-gray-600 text-sm leading-relaxed bg-transparent border-b border-dashed border-gray-300 w-full resize-none"
                    placeholder="ملخص المقالة"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                  {isEditing ? (
                    <input
                      type="text"
                      value={post.author}
                      onChange={(e) => {
                        const newPosts = [...posts];
                        newPosts[index] = { ...post, author: e.target.value };
                        onContentChange?.("posts", newPosts);
                      }}
                      className="text-sm text-gray-500 bg-transparent border-b border-dashed border-gray-300"
                      placeholder="اسم الكاتب"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">بقلم: {post.author}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const newPost: BlogPost = {
                  title: "عنوان المقالة الجديدة",
                  excerpt: "ملخص قصير للمقالة يظهر هنا...",
                  image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
                  date: new Date().toLocaleDateString('ar-SA'),
                  author: "اسم الكاتب",
                  category: "عام"
                };
                onContentChange?.("posts", [...posts, newPost]);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + إضافة مقالة
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
