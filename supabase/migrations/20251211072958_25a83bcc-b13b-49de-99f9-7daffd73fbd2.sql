-- Add admin policies for all tables to allow full CRUD operations
-- These policies allow all operations for now (public admin panel)

-- Products table policies
CREATE POLICY "Allow all insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on products" ON public.products FOR DELETE USING (true);

-- Allow selecting all products (not just active) for admin
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Categories table policies
CREATE POLICY "Allow all insert on categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on categories" ON public.categories FOR DELETE USING (true);

-- Colors table policies
CREATE POLICY "Allow all insert on colors" ON public.colors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on colors" ON public.colors FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on colors" ON public.colors FOR DELETE USING (true);

-- Sizes table policies
CREATE POLICY "Allow all insert on sizes" ON public.sizes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on sizes" ON public.sizes FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on sizes" ON public.sizes FOR DELETE USING (true);

-- Governorates table policies
CREATE POLICY "Allow all insert on governorates" ON public.governorates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on governorates" ON public.governorates FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on governorates" ON public.governorates FOR DELETE USING (true);

-- Allow selecting all governorates (not just active) for admin
DROP POLICY IF EXISTS "Active governorates are viewable by everyone" ON public.governorates;
CREATE POLICY "Governorates are viewable by everyone" ON public.governorates FOR SELECT USING (true);

-- Advertisements table policies
CREATE POLICY "Allow all insert on advertisements" ON public.advertisements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on advertisements" ON public.advertisements FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on advertisements" ON public.advertisements FOR DELETE USING (true);

-- Allow selecting all advertisements (not just active) for admin
DROP POLICY IF EXISTS "Active advertisements are viewable by everyone" ON public.advertisements;
CREATE POLICY "Advertisements are viewable by everyone" ON public.advertisements FOR SELECT USING (true);

-- Orders table policies (for admin to view and update)
CREATE POLICY "Allow all select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow all update on orders" ON public.orders FOR UPDATE USING (true);

-- Order items table policies (for admin to view)
CREATE POLICY "Allow all select on order_items" ON public.order_items FOR SELECT USING (true);