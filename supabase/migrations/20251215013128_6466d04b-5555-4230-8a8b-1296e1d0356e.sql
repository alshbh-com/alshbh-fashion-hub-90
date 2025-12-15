-- Add order_number column for sequential display
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number SERIAL;

-- Add delete policy for orders
CREATE POLICY "Allow all delete on orders" 
ON public.orders 
FOR DELETE 
USING (true);