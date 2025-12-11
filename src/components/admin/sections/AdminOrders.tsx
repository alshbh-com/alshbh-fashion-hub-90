import { useState, useEffect } from "react";
import { Loader2, Eye, Check, X, Truck, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Order {
  id: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
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

  const getStatusBadge = (status: string | null) => {
    const statusInfo = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>{statusInfo.label}</span>;
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

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-medium">{order.customer_name}</TableCell>
                <TableCell dir="ltr" className="text-right">{order.phone_primary}</TableCell>
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
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select
                      value={order.status || "pending"}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">العميل</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium" dir="ltr">{selectedOrder.phone_primary}</p>
                  {selectedOrder.phone_secondary && (
                    <p className="text-sm" dir="ltr">{selectedOrder.phone_secondary}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">العنوان</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">ملاحظات</p>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">المنتجات</h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">{item.price * item.quantity} ج.م</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{selectedOrder.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>{selectedOrder.shipping_price} ج.م</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary">{selectedOrder.total_price} ج.م</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
