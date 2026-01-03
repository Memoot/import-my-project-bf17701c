import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllAdRequests, useUpdateAdRequest } from "@/hooks/useAdRequests";
import { Megaphone, Loader2, Eye, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "قيد المراجعة", variant: "secondary" },
  approved: { label: "معتمد", variant: "default" },
  rejected: { label: "مرفوض", variant: "destructive" },
  active: { label: "نشط", variant: "default" },
  expired: { label: "منتهي", variant: "outline" },
};

export default function AdRequestsManagementPage() {
  const { data: requests, isLoading } = useAllAdRequests();
  const updateRequest = useUpdateAdRequest();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setNewStatus(request.status);
    setShowDetails(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    
    const updateData: any = {
      id: selectedRequest.id,
      status: newStatus,
      admin_notes: adminNotes,
    };

    if (newStatus === "approved" || newStatus === "active") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (selectedRequest.ad_packages?.duration_days || 30));
      updateData.start_date = startDate.toISOString().split("T")[0];
      updateData.end_date = endDate.toISOString().split("T")[0];
    }

    await updateRequest.mutateAsync(updateData);
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة طلبات الإعلانات" description="مراجعة الطلبات" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Megaphone className="w-8 h-8 text-primary" />
                </div>
                إدارة طلبات الإعلانات
              </h1>
              <p className="text-muted-foreground mt-2">مراجعة وإدارة طلبات الإعلانات من المستخدمين</p>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : requests && requests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">العنوان</TableHead>
                        <TableHead className="text-right">الباقة</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.title}</div>
                              {request.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {request.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.ad_packages?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusLabels[request.status]?.variant}>
                              {statusLabels[request.status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.created_at), "dd MMM yyyy", { locale: ar })}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)}>
                              <Eye className="w-4 h-4 ml-2" />
                              عرض
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد طلبات إعلانات</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>تفاصيل طلب الإعلان</DialogTitle>
                </DialogHeader>
                {selectedRequest && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">العنوان:</span>
                        <span className="font-medium">{selectedRequest.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الباقة:</span>
                        <span>{selectedRequest.ad_packages?.name || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">السعر:</span>
                        <span className="font-bold text-primary">${selectedRequest.ad_packages?.price || 0}</span>
                      </div>
                      {selectedRequest.link_url && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الرابط:</span>
                          <a href={selectedRequest.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            عرض
                          </a>
                        </div>
                      )}
                    </div>

                    {selectedRequest.image_url && (
                      <div className="rounded-lg overflow-hidden border">
                        <img src={selectedRequest.image_url} alt="" className="w-full h-40 object-cover" />
                      </div>
                    )}

                    {selectedRequest.description && (
                      <div>
                        <Label className="text-muted-foreground">الوصف</Label>
                        <p className="mt-1">{selectedRequest.description}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                          <SelectItem value="approved">معتمد</SelectItem>
                          <SelectItem value="rejected">مرفوض</SelectItem>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="expired">منتهي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin_notes">ملاحظات الإدارة</Label>
                      <Textarea
                        id="admin_notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="أضف ملاحظاتك هنا..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary-gradient" 
                        onClick={handleUpdateStatus}
                        disabled={updateRequest.isPending}
                      >
                        {updateRequest.isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                        حفظ التغييرات
                      </Button>
                      <Button variant="outline" onClick={() => setShowDetails(false)}>
                        إلغاء
                      </Button>
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
