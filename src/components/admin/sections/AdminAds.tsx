import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Advertisement {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string;
  link: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const AdminAds = () => {
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    image_url: "",
    link: "",
    is_active: true,
    sort_order: "0",
  });

  const fetchAds = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setAds(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      image_url: "",
      link: "",
      is_active: true,
      sort_order: "0",
    });
    setEditingAd(null);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      title_ar: ad.title_ar || "",
      description: ad.description || "",
      description_ar: ad.description_ar || "",
      image_url: ad.image_url,
      link: ad.link || "",
      is_active: ad.is_active ?? true,
      sort_order: (ad.sort_order || 0).toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adData = {
      title: formData.title,
      title_ar: formData.title_ar || null,
      description: formData.description || null,
      description_ar: formData.description_ar || null,
      image_url: formData.image_url,
      link: formData.link || null,
      is_active: formData.is_active,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    if (editingAd) {
      const { error } = await supabase
        .from("advertisements")
        .update(adData)
        .eq("id", editingAd.id);

      if (error) {
        toast({ title: "خطأ", description: "فشل تحديث الإعلان", variant: "destructive" });
      } else {
        toast({ title: "تم التحديث", description: "تم تحديث الإعلان بنجاح" });
        fetchAds();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("advertisements").insert(adData);

      if (error) {
        toast({ title: "خطأ", description: "فشل إضافة الإعلان", variant: "destructive" });
      } else {
        toast({ title: "تمت الإضافة", description: "تم إضافة الإعلان بنجاح" });
        fetchAds();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    const { error } = await supabase.from("advertisements").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف الإعلان", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف الإعلان بنجاح" });
      fetchAds();
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
        <h2 className="text-2xl font-bold">إدارة الإعلانات</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة إعلان
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAd ? "تعديل الإعلان" : "إضافة إعلان جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان (إنجليزي)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>العنوان (عربي)</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الوصف (إنجليزي)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف (عربي)</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الرابط (اختياري)</Label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
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
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>نشط</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingAd ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-right">الترتيب</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{ad.title_ar || ad.title}</p>
                    <p className="text-sm text-muted-foreground">{ad.title}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ad.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ad.is_active ? "نشط" : "غير نشط"}
                  </span>
                </TableCell>
                <TableCell>{ad.sort_order}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(ad.id)}
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

export default AdminAds;
