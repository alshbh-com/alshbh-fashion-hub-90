import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Size {
  id: string;
  name: string;
  sort_order: number | null;
}

const AdminSizes = () => {
  const { toast } = useToast();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [formData, setFormData] = useState({ name: "", sort_order: "0" });

  const fetchSizes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("sizes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setSizes(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", sort_order: "0" });
    setEditingSize(null);
  };

  const handleEdit = (size: Size) => {
    setEditingSize(size);
    setFormData({ name: size.name, sort_order: (size.sort_order || 0).toString() });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sizeData = {
      name: formData.name,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    if (editingSize) {
      const { error } = await supabase
        .from("sizes")
        .update(sizeData)
        .eq("id", editingSize.id);

      if (error) {
        toast({ title: "خطأ", description: "فشل تحديث المقاس", variant: "destructive" });
      } else {
        toast({ title: "تم التحديث", description: "تم تحديث المقاس بنجاح" });
        fetchSizes();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("sizes").insert(sizeData);

      if (error) {
        toast({ title: "خطأ", description: "فشل إضافة المقاس", variant: "destructive" });
      } else {
        toast({ title: "تمت الإضافة", description: "تم إضافة المقاس بنجاح" });
        fetchSizes();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقاس؟")) return;

    const { error } = await supabase.from("sizes").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف المقاس", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف المقاس بنجاح" });
      fetchSizes();
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
        <h2 className="text-2xl font-bold">إدارة المقاسات</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة مقاس
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSize ? "تعديل المقاس" : "إضافة مقاس جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المقاس</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: S, M, L, XL"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>ترتيب العرض</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingSize ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المقاس</TableHead>
              <TableHead className="text-right">ترتيب العرض</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.id}>
                <TableCell className="font-medium">{size.name}</TableCell>
                <TableCell>{size.sort_order}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(size)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(size.id)}
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

export default AdminSizes;
