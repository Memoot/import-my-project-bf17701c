import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Loader2, Eye, Trash2, Mail, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  replied_at: string | null;
  created_at: string;
}

function useContactMessages() {
  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });
}

function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: any = { status };
      if (status === "replied") {
        updateData.replied_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("contact_messages")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({ title: "تم تحديث الحالة" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({ title: "تم حذف الرسالة" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export default function ContactMessagesPage() {
  const { data: messages, isLoading } = useContactMessages();
  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteMessage();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetails(true);
    if (message.status === "unread") {
      updateStatus.mutate({ id: message.id, status: "read" });
    }
  };

  const handleMarkReplied = () => {
    if (selectedMessage) {
      updateStatus.mutate({ id: selectedMessage.id, status: "replied" });
      setShowDetails(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      deleteMessage.mutate(id);
    }
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
    unread: { label: "غير مقروء", variant: "destructive", icon: Clock },
    read: { label: "مقروء", variant: "secondary", icon: Eye },
    replied: { label: "تم الرد", variant: "default", icon: CheckCircle },
  };

  const unreadCount = messages?.filter(m => m.status === "unread").length || 0;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title="رسائل التواصل" description="إدارة رسائل الزوار" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                رسائل التواصل
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="mr-2">{unreadCount} جديد</Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-2">إدارة ومتابعة رسائل الزوار</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الرسائل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">غير مقروء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{unreadCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">تم الرد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {messages?.filter(m => m.status === "replied").length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المرسل</TableHead>
                        <TableHead className="text-right">الموضوع</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => {
                        const status = statusConfig[message.status] || statusConfig.unread;
                        const StatusIcon = status.icon;
                        return (
                          <TableRow key={message.id} className={message.status === "unread" ? "bg-primary/5" : ""}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{message.name}</div>
                                <div className="text-sm text-muted-foreground" dir="ltr">{message.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">{message.subject || message.message.slice(0, 50)}</div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(message.created_at), "dd MMM yyyy HH:mm", { locale: ar })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive"
                                  onClick={() => handleDelete(message.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد رسائل</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>تفاصيل الرسالة</DialogTitle>
                </DialogHeader>
                {selectedMessage && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الاسم:</span>
                        <span className="font-medium">{selectedMessage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">البريد:</span>
                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline" dir="ltr">
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.subject && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الموضوع:</span>
                          <span>{selectedMessage.subject}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التاريخ:</span>
                        <span>{format(new Date(selectedMessage.created_at), "dd MMM yyyy HH:mm", { locale: ar })}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الرسالة:</label>
                      <div className="mt-2 p-4 rounded-lg bg-muted/30 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "رسالتك"}`}>
                          <Mail className="w-4 h-4 ml-2" />
                          إرسال رد بالبريد
                        </a>
                      </Button>
                      {selectedMessage.status !== "replied" && (
                        <Button variant="outline" onClick={handleMarkReplied}>
                          <CheckCircle className="w-4 h-4 ml-2" />
                          تم الرد
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
