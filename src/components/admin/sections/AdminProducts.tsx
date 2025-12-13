import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  discount_price: number | null;
  category_id: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  rating: number | null;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
  sort_order: number | null;
}

interface ProductColor {
  id?: string;
  name: string;
  hex_code: string;
}

interface ProductSize {
  id?: string;
  name: string;
  price: number;
}

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<Record<string, ProductImage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Colors and Sizes for the product
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [newColor, setNewColor] = useState({ name: "", hex_code: "#000000" });
  const [newSize, setNewSize] = useState({ name: "", price: "" });

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    price: "",
    discount_price: "",
    category_id: "",
    is_active: true,
    is_featured: false,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
      const { data: imagesData } = await supabase
        .from("product_images")
        .select("*")
        .in("product_id", data.map(p => p.id));
      
      if (imagesData) {
        const imagesMap: Record<string, ProductImage[]> = {};
        imagesData.forEach(img => {
          if (!imagesMap[img.product_id]) {
            imagesMap[img.product_id] = [];
          }
          imagesMap[img.product_id].push(img);
        });
        setProductImages(imagesMap);
      }
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (!newColor.name.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال اسم اللون", variant: "destructive" });
      return;
    }
    setProductColors(prev => [...prev, { name: newColor.name, hex_code: newColor.hex_code }]);
    setNewColor({ name: "", hex_code: "#000000" });
  };

  const removeColor = (index: number) => {
    setProductColors(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (!newSize.name.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال اسم المقاس", variant: "destructive" });
      return;
    }
    setProductSizes(prev => [...prev, { 
      name: newSize.name, 
      price: parseFloat(newSize.price) || 0 
    }]);
    setNewSize({ name: "", price: "" });
  };

  const removeSize = (index: number) => {
    setProductSizes(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      price: "",
      discount_price: "",
      category_id: "",
      is_active: true,
      is_featured: false,
    });
    setEditingProduct(null);
    setUploadedImages([]);
    setProductColors([]);
    setProductSizes([]);
  };

  const loadProductData = async (productId: string) => {
    // Load images
    const { data: imagesData } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);
    
    if (imagesData) {
      setUploadedImages(imagesData.map(img => img.image_url));
    }

    // Load colors
    const { data: colorsData } = await supabase
      .from("product_colors")
      .select("color_id")
      .eq("product_id", productId);
    
    if (colorsData && colorsData.length > 0) {
      const colorIds = colorsData.map(c => c.color_id);
      const { data: colors } = await supabase
        .from("colors")
        .select("*")
        .in("id", colorIds);
      
      if (colors) {
        setProductColors(colors.map(c => ({ id: c.id, name: c.name_ar, hex_code: c.hex_code })));
      }
    }

    // Load sizes
    const { data: sizesData } = await supabase
      .from("product_sizes")
      .select("size_id, price_adjustment")
      .eq("product_id", productId);
    
    if (sizesData && sizesData.length > 0) {
      const sizeIds = sizesData.map(s => s.size_id);
      const { data: sizes } = await supabase
        .from("sizes")
        .select("*")
        .in("id", sizeIds);
      
      if (sizes) {
        setProductSizes(sizes.map(s => ({
          id: s.id,
          name: s.name,
          price: sizesData.find(sd => sd.size_id === s.id)?.price_adjustment || 0
        })));
      }
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_ar: product.name_ar,
      description: product.description || "",
      description_ar: product.description_ar || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      category_id: product.category_id || "",
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
    });
    await loadProductData(product.id);
    setIsDialogOpen(true);
  };

  const saveColorsAndSizes = async (productId: string) => {
    // Delete existing colors and sizes
    await supabase.from("product_colors").delete().eq("product_id", productId);
    await supabase.from("product_sizes").delete().eq("product_id", productId);

    // Save colors
    for (const color of productColors) {
      // Check if color exists or create new one
      let colorId = color.id;
      if (!colorId) {
        const { data: existingColor } = await supabase
          .from("colors")
          .select("id")
          .eq("name_ar", color.name)
          .maybeSingle();

        if (existingColor) {
          colorId = existingColor.id;
        } else {
          const { data: newColorData } = await supabase
            .from("colors")
            .insert({ name: color.name, name_ar: color.name, hex_code: color.hex_code })
            .select()
            .single();
          
          if (newColorData) {
            colorId = newColorData.id;
          }
        }
      }

      if (colorId) {
        await supabase
          .from("product_colors")
          .insert({ product_id: productId, color_id: colorId });
      }
    }

    // Save sizes
    for (const size of productSizes) {
      // Check if size exists or create new one
      let sizeId = size.id;
      if (!sizeId) {
        const { data: existingSize } = await supabase
          .from("sizes")
          .select("id")
          .eq("name", size.name)
          .maybeSingle();

        if (existingSize) {
          sizeId = existingSize.id;
        } else {
          const { data: newSizeData } = await supabase
            .from("sizes")
            .insert({ name: size.name })
            .select()
            .single();
          
          if (newSizeData) {
            sizeId = newSizeData.id;
          }
        }
      }

      if (sizeId) {
        await supabase
          .from("product_sizes")
          .insert({ product_id: productId, size_id: sizeId, price_adjustment: size.price });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      name_ar: formData.name_ar,
      description: formData.description || null,
      description_ar: formData.description_ar || null,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      category_id: formData.category_id || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({ title: "خطأ", description: "فشل تحديث المنتج", variant: "destructive" });
        return;
      }

      // Update images
      await supabase.from("product_images").delete().eq("product_id", editingProduct.id);
      
      if (uploadedImages.length > 0) {
        const imagesData = uploadedImages.map((img, index) => ({
          product_id: editingProduct.id,
          image_url: img,
          is_primary: index === 0,
          sort_order: index,
        }));
        await supabase.from("product_images").insert(imagesData);
      }

      // Save colors and sizes
      await saveColorsAndSizes(editingProduct.id);

      toast({ title: "تم التحديث", description: "تم تحديث المنتج بنجاح" });
      fetchProducts();
      setIsDialogOpen(false);
      resetForm();
    } else {
      const { data, error } = await supabase.from("products").insert(productData).select().single();

      if (error || !data) {
        toast({ title: "خطأ", description: "فشل إضافة المنتج", variant: "destructive" });
        return;
      }

      // Insert images
      if (uploadedImages.length > 0) {
        const imagesData = uploadedImages.map((img, index) => ({
          product_id: data.id,
          image_url: img,
          is_primary: index === 0,
          sort_order: index,
        }));
        await supabase.from("product_images").insert(imagesData);
      }

      // Save colors and sizes
      await saveColorsAndSizes(data.id);

      toast({ title: "تمت الإضافة", description: "تم إضافة المنتج بنجاح" });
      fetchProducts();
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: "فشل حذف المنتج", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف", description: "تم حذف المنتج بنجاح" });
      fetchProducts();
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
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المنتج</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value, name: e.target.value })}
                  required
                  placeholder="أدخل اسم المنتج"
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value, description: e.target.value })}
                  placeholder="أدخل وصف المنتج"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>سعر الخصم</Label>
                  <Input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="اختياري"
                  />
                </div>
                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3 border rounded-lg p-4">
                <Label className="text-lg font-semibold">صور المنتج</Label>
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center rounded-b-lg">
                          رئيسية
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">رفع</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Colors Section */}
              <div className="space-y-3 border rounded-lg p-4">
                <Label className="text-lg font-semibold">الألوان المتاحة</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {productColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <div 
                        className="w-5 h-5 rounded-full border" 
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <span className="text-sm">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="اسم اللون"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={newColor.hex_code}
                    onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Button type="button" onClick={addColor} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sizes Section */}
              <div className="space-y-3 border rounded-lg p-4">
                <Label className="text-lg font-semibold">المقاسات المتاحة (مع السعر الإضافي)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {productSizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <span className="text-sm font-medium">{size.name}</span>
                      {size.price > 0 && (
                        <span className="text-xs text-primary">+{size.price} ج.م</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="المقاس"
                    value={newSize.name}
                    onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="السعر الإضافي"
                    value={newSize.price}
                    onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                    className="w-32"
                  />
                  <Button type="button" onClick={addSize} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  * السعر الإضافي يُضاف إلى سعر المنتج الأساسي عند اختيار هذا المقاس
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>نشط</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>مميز</Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingProduct ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {productImages[product.id]?.[0] && (
                      <img 
                        src={productImages[product.id][0].image_url} 
                        alt={product.name_ar}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name_ar}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {categories.find((c) => c.id === product.category_id)?.name_ar || "-"}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.price} ج.م</p>
                    {product.discount_price && (
                      <p className="text-sm text-green-600">{product.discount_price} ج.م</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_active ? "نشط" : "غير نشط"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(product.id)}
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

export default AdminProducts;