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

interface Color {
  id: string;
  name: string;
  name_ar: string;
  hex_code: string;
}

const AdminColors = () => {
  const { toast } = useToast();
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({ name: "", name_ar: "", hex_code: "#000000" });

  const fetchColors = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("name_ar", { ascending: true });

    if (!error && data) {
      setColors(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", name_ar: "", hex_code: "#000000" });
    setEditingColor(null);
  };

  const handleEdit = (color: Color) => {
    setEditingColor(color);
    setFormData({ name: color.name, name_ar: color.name_ar, hex_code: color.hex_code });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingColor) {
      const { error } = await supabase
        .from("colors")
        .update(formData)
        .eq("id", editingColor.id);

      if (error) {
        toast({ title: "خطأ", description: "فشل تحديث اللون", variant: "destructive" });
      } else {
        toast({ title: "تم التحديث", description: "تم تحديث اللون بنجاح" });
        fetchColors();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("colors").insert(formData);

      if (error) {
        toast({ title: "خطأ", description: "فشل إضافة اللون", variant: "destructive" });
      } else {
        toast({ title: "تمت الإضافة", description: "تم إضافة اللون بنجاح" });
        fetchColors();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا اللون؟")) return;

    const { error } = await supabase.from("colors").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف اللون", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف اللون بنجاح" });
      fetchColors();
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
        <h2 className="text-2xl font-bold">إدارة الألوان</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة لون
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingColor ? "تعديل اللون" : "إضافة لون جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم اللون (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>اسم اللون (عربي)</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>كود اللون</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.hex_code}
                    onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.hex_code}
                    onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                    placeholder="#000000"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingColor ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اللون</TableHead>
              <TableHead className="text-right">الاسم (عربي)</TableHead>
              <TableHead className="text-right">الاسم (إنجليزي)</TableHead>
              <TableHead className="text-right">الكود</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colors.map((color) => (
              <TableRow key={color.id}>
                <TableCell>
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: color.hex_code }}
                  />
                </TableCell>
                <TableCell className="font-medium">{color.name_ar}</TableCell>
                <TableCell>{color.name}</TableCell>
                <TableCell className="font-mono">{color.hex_code}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(color)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(color.id)}
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

export default AdminColors;
