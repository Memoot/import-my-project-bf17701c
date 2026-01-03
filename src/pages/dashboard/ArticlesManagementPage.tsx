import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  useAllArticles, 
  useCreateArticle, 
  useUpdateArticle, 
  useDeleteArticle,
  Article 
} from "@/hooks/useArticles";
import { FileText, Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function ArticlesManagementPage() {
  const { data: articles, isLoading } = useAllArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [showDialog, setShowDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    tags: [] as string[],
    is_published: false,
  });
  const [newTag, setNewTag] = useState("");

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      category: "",
      tags: [],
      is_published: false,
    });
    setEditingArticle(null);
    setNewTag("");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      cover_image: article.cover_image || "",
      category: article.category || "",
      tags: article.tags || [],
      is_published: article.is_published,
    });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    if (editingArticle) {
      await updateArticle.mutateAsync({ id: editingArticle.id, ...data });
    } else {
      await createArticle.mutateAsync(data);
    }
    
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      await deleteArticle.mutateAsync(id);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة المقالات" description="إضافة وتعديل المقالات" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  إدارة المقالات
                </h1>
                <p className="text-muted-foreground mt-2">إضافة وتعديل المقالات في المدونة</p>
              </div>
              <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary-gradient">
                    <Plus className="w-4 h-4 ml-2" />
                    مقال جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? "تعديل المقال" : "إضافة مقال جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان المقال</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({ 
                            ...formData, 
                            title,
                            slug: formData.slug || generateSlug(title),
                          });
                        }}
                        placeholder="عنوان المقال"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">الرابط المختصر (Slug)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="article-slug"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">المقتطف</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="وصف مختصر للمقال"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">المحتوى</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="محتوى المقال..."
                        rows={8}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cover_image">صورة الغلاف (URL)</Label>
                        <Input
                          id="cover_image"
                          value={formData.cover_image}
                          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">التصنيف</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="التسويق الرقمي"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>الوسوم</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="وسم جديد"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(i)}
                              className="mr-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <Label htmlFor="is_published" className="font-medium">نشر المقال</Label>
                        <p className="text-sm text-muted-foreground">سيظهر المقال في المدونة للجميع</p>
                      </div>
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary-gradient" disabled={createArticle.isPending || updateArticle.isPending}>
                      {(createArticle.isPending || updateArticle.isPending) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      {editingArticle ? "حفظ التعديلات" : "إضافة المقال"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : articles && articles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المقال</TableHead>
                        <TableHead className="text-right">التصنيف</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">المشاهدات</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {article.cover_image && (
                                <img 
                                  src={article.cover_image} 
                                  alt="" 
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{article.title}</div>
                                {article.excerpt && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {article.excerpt}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {article.category ? (
                              <Badge variant="outline">{article.category}</Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={article.is_published ? "default" : "secondary"}>
                              {article.is_published ? (
                                <><Eye className="w-3 h-3 ml-1" /> منشور</>
                              ) : (
                                <><EyeOff className="w-3 h-3 ml-1" /> مسودة</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{article.views_count}</TableCell>
                          <TableCell>
                            {format(new Date(article.created_at), "dd MMM yyyy", { locale: ar })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد مقالات بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
