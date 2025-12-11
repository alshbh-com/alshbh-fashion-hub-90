import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Governorate {
  id: string;
  name: string;
  name_ar: string;
  shipping_price: number;
  is_active: boolean | null;
}

const AdminGovernorates = () => {
  const { toast } = useToast();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGovernorate, setEditingGovernorate] = useState<Governorate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    shipping_price: "",
    is_active: true,
  });

  const fetchGovernorates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("governorates")
      .select("*")
      .order("name_ar", { ascending: true });

    if (!error && data) {
      setGovernorates(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGovernorates();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", name_ar: "", shipping_price: "", is_active: true });
    setEditingGovernorate(null);
  };

  const handleEdit = (governorate: Governorate) => {
    setEditingGovernorate(governorate);
    setFormData({
      name: governorate.name,
      name_ar: governorate.name_ar,
      shipping_price: governorate.shipping_price.toString(),
      is_active: governorate.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const governorateData = {
      name: formData.name,
      name_ar: formData.name_ar,
      shipping_price: parseFloat(formData.shipping_price),
      is_active: formData.is_active,
    };

    if (editingGovernorate) {
      const { error } = await supabase
        .from("governorates")
        .update(governorateData)
        .eq("id", editingGovernorate.id);

      if (error) {
        toast({ title: "خطأ", description: "فشل تحديث المحافظة", variant: "destructive" });
      } else {
        toast({ title: "تم التحديث", description: "تم تحديث المحافظة بنجاح" });
        fetchGovernorates();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("governorates").insert(governorateData);

      if (error) {
        toast({ title: "خطأ", description: "فشل إضافة المحافظة", variant: "destructive" });
      } else {
        toast({ title: "تمت الإضافة", description: "تم إضافة المحافظة بنجاح" });
        fetchGovernorates();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحافظة؟")) return;

    const { error } = await supabase.from("governorates").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف المحافظة", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف المحافظة بنجاح" });
      fetchGovernorates();
    }
  };

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
        <h2 className="text-2xl font-bold">إدارة المحافظات</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة محافظة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGovernorate ? "تعديل المحافظة" : "إضافة محافظة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المحافظة (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المحافظة (عربي)</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>سعر الشحن (ج.م)</Label>
                <Input
                  type="number"
                  value={formData.shipping_price}
                  onChange={(e) => setFormData({ ...formData, shipping_price: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>نشط</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingGovernorate ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المحافظة (عربي)</TableHead>
              <TableHead className="text-right">المحافظة (إنجليزي)</TableHead>
              <TableHead className="text-right">سعر الشحن</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {governorates.map((gov) => (
              <TableRow key={gov.id}>
                <TableCell className="font-medium">{gov.name_ar}</TableCell>
                <TableCell>{gov.name}</TableCell>
                <TableCell className="font-bold text-primary">{gov.shipping_price} ج.م</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      gov.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gov.is_active ? "نشط" : "غير نشط"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(gov)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(gov.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGovernorates;
