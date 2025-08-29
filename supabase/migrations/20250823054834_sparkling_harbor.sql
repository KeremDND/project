/*
  # Comprehensive Database Schema for Abadan Haly Carpet Store

  1. New Tables
    - `categories` - Product categories (Traditional, Modern, Classic)
    - `products` - Complete product catalog with all details
    - `product_images` - Multiple images per product
    - `user_profiles` - Extended user information
    - `favorites` - User favorite products
    - `cart_items` - Shopping cart functionality
    - `orders` - Order management
    - `order_items` - Order line items
    - `contact_messages` - Contact form submissions
    - `reviews` - Product reviews and ratings
    - `stores` - Store locations
    - `inventory` - Stock management per store

  2. Security
    - Enable RLS on all tables
    - Proper policies for authenticated and public access
    - Admin-only policies for sensitive operations

  3. Relationships
    - Foreign key constraints between related tables
    - Proper indexing for performance
    - Cascading deletes where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  base_price decimal(10,2) NOT NULL,
  sale_price decimal(10,2),
  sku text UNIQUE,
  material text DEFAULT 'Premium Polypropylene',
  knot_density text DEFAULT '400+ knots/m²',
  pile_height text DEFAULT '12mm',
  origin text DEFAULT 'Made in Turkmenistan',
  care_instructions text[],
  features text[],
  sizes jsonb DEFAULT '[]'::jsonb, -- Array of size objects with dimensions and prices
  colors text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  address jsonb, -- {street, city, country, postal_code}
  preferences jsonb DEFAULT '{}'::jsonb, -- User preferences
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size_info jsonb NOT NULL, -- {width, height, price}
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, size_info)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'TMT',
  customer_info jsonb NOT NULL, -- {name, email, phone, address}
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL, -- Store name in case product is deleted
  product_sku text,
  size_info jsonb NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  phone text,
  email text,
  coordinates jsonb, -- {lat, lng}
  hours jsonb, -- {weekdays, saturday, sunday}
  services text[],
  specialties text[],
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  size_info jsonb NOT NULL,
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity integer DEFAULT 0 CHECK (reserved_quantity >= 0),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, store_id, size_info)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_store ON inventory(store_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Product images: Public read, admin write
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage product images" ON product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- User profiles: Users can read/update their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Cart items: Users can manage their own cart
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Order items: Same as orders
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND is_admin = true
        )
      )
    )
  );

CREATE POLICY "Order items are created with orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Contact messages: Anyone can create, admins can view all
CREATE POLICY "Anyone can send contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own messages" ON contact_messages
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update contact messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Reviews: Public read approved reviews, users manage their own
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Stores: Public read, admin write
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage stores" ON stores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Inventory: Public read, admin write
CREATE POLICY "Inventory is viewable by everyone" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage inventory" ON inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Traditional', 'traditional', 'Classic Turkmen carpet designs with traditional patterns', 1),
  ('Modern', 'modern', 'Contemporary designs for modern living spaces', 2),
  ('Classic', 'classic', 'Timeless designs that never go out of style', 3)
ON CONFLICT (slug) DO NOTHING;

-- Sample products
INSERT INTO products (
  name, slug, description, category_id, base_price, sale_price, sku, 
  sizes, colors, is_featured, features, care_instructions
) VALUES
  (
    'Persian Heritage Classic',
    'persian-heritage-classic',
    'Experience the timeless beauty of traditional Persian craftsmanship with our Heritage Collection carpet.',
    (SELECT id FROM categories WHERE slug = 'traditional'),
    1599.00, 1299.00, 'AH-PHC-001',
    '[
      {"size": "140x200", "price": 999},
      {"size": "160x230", "price": 1199},
      {"size": "200x300", "price": 1299},
      {"size": "250x350", "price": 1599}
    ]'::jsonb,
    ARRAY['Burgundy & Gold', 'Navy & Cream', 'Forest & Beige'],
    true,
    ARRAY['Hand-selected premium polypropylene fibers', 'Traditional Persian weaving techniques', 'Fade-resistant colors with UV protection', 'Anti-slip backing for safety'],
    ARRAY['Regular vacuuming recommended', 'Professional cleaning yearly', 'Rotate periodically for even wear', 'Keep away from direct sunlight']
  ),
  (
    'Contemporary Wave',
    'contemporary-wave',
    'Modern geometric patterns perfect for contemporary living spaces.',
    (SELECT id FROM categories WHERE slug = 'modern'),
    1199.00, 899.00, 'AH-CW-002',
    '[
      {"size": "140x200", "price": 699},
      {"size": "160x230", "price": 899},
      {"size": "200x300", "price": 1099},
      {"size": "250x350", "price": 1199}
    ]'::jsonb,
    ARRAY['Blue & White', 'Gray & Black', 'Teal & Cream'],
    true,
    ARRAY['Modern geometric design', 'Premium polypropylene construction', 'Easy maintenance', 'Suitable for high-traffic areas'],
    ARRAY['Vacuum regularly', 'Spot clean spills immediately', 'Professional cleaning as needed']
  ),
  (
    'Royal Palace Design',
    'royal-palace-design',
    'Luxurious traditional motifs with rich colors inspired by royal palaces.',
    (SELECT id FROM categories WHERE slug = 'classic'),
    2199.00, 1899.00, 'AH-RPD-003',
    '[
      {"size": "160x230", "price": 1599},
      {"size": "200x300", "price": 1899},
      {"size": "250x350", "price": 2199},
      {"size": "300x400", "price": 2599}
    ]'::jsonb,
    ARRAY['Deep Red & Gold', 'Royal Blue & Silver', 'Emerald & Bronze'],
    true,
    ARRAY['Intricate palace-inspired patterns', 'Premium materials', 'Exceptional durability', 'Handcrafted details'],
    ARRAY['Professional cleaning recommended', 'Vacuum with care', 'Protect from direct sunlight', 'Rotate quarterly']
  )
ON CONFLICT (slug) DO NOTHING;

-- Sample stores
INSERT INTO stores (name, address, city, phone, coordinates, hours, services, specialties) VALUES
  (
    'Abadan Haly Main Showroom',
    'Abadan district, Ashgabat',
    'Ashgabat',
    '+993 12 345-678',
    '{"lat": 37.9601, "lng": 58.3261}'::jsonb,
    '{"weekdays": "9:00 - 19:00", "saturday": "9:00 - 18:00", "sunday": "10:00 - 17:00"}'::jsonb,
    ARRAY['Expert Consultation', 'AR Demonstrations', 'Custom Orders', 'Installation Service'],
    ARRAY['Premium Collection', 'Traditional Designs', 'Custom Sizing']
  ),
  (
    'Central District Store',
    'Central district, Ashgabat',
    'Ashgabat',
    '+993 12 345-679',
    '{"lat": 37.9755, "lng": 58.3794}'::jsonb,
    '{"weekdays": "9:00 - 18:00", "saturday": "9:00 - 17:00", "sunday": "10:00 - 16:00"}'::jsonb,
    ARRAY['Product Display', 'Size Consultation', 'Delivery Service', 'Maintenance Support'],
    ARRAY['Modern Collection', 'Quick Service', 'Urban Designs']
  )
ON CONFLICT DO NOTHING;