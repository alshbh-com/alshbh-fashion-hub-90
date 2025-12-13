-- Allow full CRUD on product_images for admin operations
CREATE POLICY "Allow all insert on product_images" 
ON public.product_images 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all update on product_images" 
ON public.product_images 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all delete on product_images" 
ON public.product_images 
FOR DELETE 
USING (true);