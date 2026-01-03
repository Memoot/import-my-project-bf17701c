import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, UserMinus, Search, MoreHorizontal, Mail, Trash2, Layout, Download, Upload, Loader2 } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriptionFormTemplates } from '@/components/subscribers/SubscriptionFormTemplates';
import { AddSubscriberDialog } from '@/components/subscribers/AddSubscriberDialog';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'unsubscribed':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'bounced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'نشط';
    case 'unsubscribed':
      return 'ملغي';
    case 'bounced':
      return 'مرتد';
    default:
      return status;
  }
};

export default function SubscribersManagementPage() {
  const { subscribers, loading, addSubscriber, updateSubscriber, deleteSubscriber, getStats } = useSubscribers();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const stats = getStats();

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = () => {
    const csvContent = [
      ['البريد الإلكتروني', 'الاسم', 'الحالة', 'تاريخ الاشتراك'].join(','),
      ...subscribers.map(s => [
        s.email,
        s.name || '',
        getStatusLabel(s.status),
        format(new Date(s.subscribed_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة المشتركين" description="إدارة قائمتك البريدية ونماذج الاشتراك" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="إجمالي المشتركين"
              value={stats.total.toString()}
              icon={Users}
              change={`${stats.total} مشترك`}
              changeType="neutral"
            />
            <StatsCard
              title="المشتركين النشطين"
              value={stats.active.toString()}
              icon={UserPlus}
              change={`${stats.active} نشط`}
              changeType="positive"
            />
            <StatsCard
              title="إلغاء الاشتراك"
              value={stats.unsubscribed.toString()}
              icon={UserMinus}
              change={`${stats.unsubscribed} ملغي`}
              changeType="negative"
            />
            <StatsCard
              title="مشتركين هذا الشهر"
              value={stats.thisMonth.toString()}
              icon={Mail}
              change="هذا الشهر"
              changeType="positive"
            />
          </div>

          <Tabs defaultValue="subscribers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subscribers">
                <Users className="h-4 w-4 ml-1" />
                المشتركين
              </TabsTrigger>
              <TabsTrigger value="forms">
                <Layout className="h-4 w-4 ml-1" />
                نماذج الاشتراك
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>قائمة المشتركين</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="بحث..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-9"
                        />
                      </div>
                      <Button variant="outline" size="icon" onClick={handleExport} title="تصدير">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => setShowAddDialog(true)}>
                        <UserPlus className="h-4 w-4 ml-1" />
                        إضافة مشترك
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredSubscribers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {searchQuery ? 'لا توجد نتائج' : 'لا يوجد مشتركين بعد'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>المشترك</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>المصدر</TableHead>
                            <TableHead>تاريخ الاشتراك</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{subscriber.name || 'بدون اسم'}</p>
                                  <p className="text-sm text-muted-foreground" dir="ltr">
                                    {subscriber.email}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(subscriber.status)}>
                                  {getStatusLabel(subscriber.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {subscriber.source || 'غير محدد'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(subscriber.subscribed_at), 'dd MMM yyyy', { locale: ar })}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {subscriber.status === 'active' ? (
                                      <DropdownMenuItem
                                        onClick={() => updateSubscriber(subscriber.id, { 
                                          status: 'unsubscribed' 
                                        })}
                                      >
                                        <UserMinus className="h-4 w-4 ml-2" />
                                        إلغاء الاشتراك
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() => updateSubscriber(subscriber.id, { 
                                          status: 'active' 
                                        })}
                                      >
                                        <UserPlus className="h-4 w-4 ml-2" />
                                        تفعيل الاشتراك
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => deleteSubscriber(subscriber.id)}
                                    >
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      حذف
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms">
              {userId && <SubscriptionFormTemplates userId={userId} />}
            </TabsContent>
          </Tabs>

          <AddSubscriberDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onAdd={addSubscriber}
          />
        </main>
      </div>
    </div>
  );
}
