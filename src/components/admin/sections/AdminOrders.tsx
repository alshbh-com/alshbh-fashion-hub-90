import { useState, useEffect } from "react";
import { Loader2, Eye, Trash2, MapPin, Phone, User, FileText, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

interface Governorate {
  id: string;
  name: string;
  name_ar: string;
}

interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  phone_primary: string;
  phone_secondary: string | null;
  address: string;
  notes: string | null;
  subtotal: number;
  shipping_price: number;
  total_price: number;
  status: string | null;
  created_at: string | null;
  governorate_id: string | null;
}

const statusOptions = [
  { value: "pending", label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
  { value: "preparing", label: "تم التجهيز", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "تم الشحن", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "تم التوصيل", color: "bg-green-100 text-green-800" },
  { value: "canceled", label: "ملغي", color: "bg-red-100 text-red-800" },
];

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("order_number", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const fetchGovernorates = async () => {
    const { data } = await supabase.from("governorates").select("id, name, name_ar");
    if (data) setGovernorates(data);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (data) {
      setOrderItems(data);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchGovernorates();
  }, []);

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({ title: "خطأ", description: "فشل تحديث حالة الطلب", variant: "destructive" });
    } else {
      toast({ title: "تم التحديث", description: "تم تحديث حالة الطلب بنجاح" });
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    // First delete order items
    await supabase.from("order_items").delete().eq("order_id", orderId);
    
    // Then delete the order
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف الطلب", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف الطلب بنجاح" });
      fetchOrders();
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusInfo = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>{statusInfo.label}</span>;
  };

  const getGovernorateName = (governorateId: string | null) => {
    if (!governorateId) return "غير محدد";
    const gov = governorates.find(g => g.id === governorateId);
    return gov ? gov.name_ar : "غير محدد";
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter((order) => order.status === statusFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الطلبات</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.map((status) => (
          <div key={status.value} className="bg-card p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === status.value).length}
            </p>
            <p className="text-sm text-muted-foreground">{status.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المحافظة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-bold text-primary">
                  #{order.order_number}
                </TableCell>
                <TableCell className="font-medium">{order.customer_name}</TableCell>
                <TableCell>{getGovernorateName(order.governorate_id)}</TableCell>
                <TableCell className="font-bold text-primary">
                  {order.total_price} ج.م
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("ar-EG")
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف الطلب</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف الطلب #{order.order_number}؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Select
                      value={order.status || "pending"}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              طلب #{selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4" dir="rtl">
              {/* Customer Info Card */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-bold">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span dir="ltr">{selectedOrder.phone_primary}</span>
                  {selectedOrder.phone_secondary && (
                    <span dir="ltr" className="text-muted-foreground">/ {selectedOrder.phone_secondary}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">{getGovernorateName(selectedOrder.governorate_id)}</span>
                  <span className="text-muted-foreground">- {selectedOrder.address}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Products */}
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  المنتجات
                </h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{item.color}</Badge>
                          <Badge variant="outline">{item.size}</Badge>
                          <span>× {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-bold text-primary">{item.price * item.quantity} ج.م</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي</span>
                  <span>{selectedOrder.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الشحن ({getGovernorateName(selectedOrder.governorate_id)})</span>
                  <span>{selectedOrder.shipping_price} ج.م</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    الإجمالي
                  </span>
                  <span className="text-primary">{selectedOrder.total_price} ج.م</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-medium">حالة الطلب:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
