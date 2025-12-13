-- Allow insert/update/delete on product_colors
DROP POLICY IF EXISTS "Product colors are viewable by everyone" ON product_colors;
CREATE POLICY "Allow all on product_colors" ON product_colors FOR ALL USING (true) WITH CHECK (true);

-- Allow insert/update/delete on product_sizes
DROP POLICY IF EXISTS "Product sizes are viewable by everyone" ON product_sizes;
CREATE POLICY "Allow all on product_sizes" ON product_sizes FOR ALL USING (true) WITH CHECK (true);