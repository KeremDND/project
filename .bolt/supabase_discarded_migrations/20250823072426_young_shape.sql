/*
  # Sample Data for Abadan Haly

  1. Categories
    - Traditional, Modern, Classic carpet categories

  2. Products
    - Sample carpet products with realistic data
    - Proper pricing and specifications

  3. Stores
    - Physical store locations in Ashgabat

  4. Product Images
    - Sample images for products
*/

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Traditional', 'traditional', 'Classic Turkmen carpet designs with traditional patterns', 1),
('Modern', 'modern', 'Contemporary carpet designs for modern interiors', 2),
('Classic', 'classic', 'Timeless carpet designs that never go out of style', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (
  name, slug, description, category_id, base_price, sale_price, sku,
  material, knot_density, pile_height, origin,
  care_instructions, features, sizes, colors, is_featured, is_active
) VALUES
(
  'Persian Heritage Classic',
  'persian-heritage-classic',
  'Beautiful handwoven traditional carpet with intricate Persian patterns and rich colors',
  (SELECT id FROM categories WHERE slug = 'traditional'),
  1400.00, 1200.00, 'AH-PER-001',
  'Premium Polypropylene', '450 knots/m²', '12mm', 'Made in Turkmenistan',
  ARRAY['Regular vacuuming', 'Professional cleaning yearly', 'Rotate periodically'],
  ARRAY['Fade-resistant colors', 'Anti-slip backing', 'Stain resistant'],
  '[{"size": "200x300", "price": 1200}, {"size": "250x350", "price": 1800}]'::jsonb,
  ARRAY['Burgundy & Gold', 'Navy & Cream'],
  true, true
),
(
  'Modern Geometric Carpet',
  'modern-geometric-carpet',
  'Contemporary design with geometric patterns perfect for modern spaces',
  (SELECT id FROM categories WHERE slug = 'modern'),
  1050.00, 800.00, 'AH-MOD-001',
  'Premium Polypropylene', '380 knots/m²', '10mm', 'Made in Turkmenistan',
  ARRAY['Regular vacuuming', 'Professional cleaning yearly', 'Avoid direct sunlight'],
  ARRAY['Modern design', 'Easy maintenance', 'Durable construction'],
  '[{"size": "160x230", "price": 800}, {"size": "200x300", "price": 1200}]'::jsonb,
  ARRAY['Charcoal & Silver', 'Blue & White'],
  true, true
),
(
  'Royal Palace Design',
  'royal-palace-design',
  'Luxurious traditional motifs with rich colors inspired by royal palaces',
  (SELECT id FROM categories WHERE slug = 'classic'),
  1800.00, 1599.00, 'AH-ROY-001',
  'Premium Polypropylene', '500 knots/m²', '15mm', 'Made in Turkmenistan',
  ARRAY['Professional cleaning recommended', 'Rotate every 6 months', 'Vacuum gently'],
  ARRAY['Luxury design', 'High knot density', 'Premium materials'],
  '[{"size": "220x320", "price": 1599}, {"size": "250x350", "price": 2200}]'::jsonb,
  ARRAY['Deep Red & Gold', 'Royal Blue & Silver'],
  false, true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
(
  (SELECT id FROM products WHERE slug = 'persian-heritage-classic'),
  'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg',
  'Persian Heritage Classic carpet main view',
  true, 1
),
(
  (SELECT id FROM products WHERE slug = 'modern-geometric-carpet'),
  'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg',
  'Modern Geometric carpet main view',
  true, 1
),
(
  (SELECT id FROM products WHERE slug = 'royal-palace-design'),
  'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg',
  'Royal Palace Design carpet main view',
  true, 1
)
ON CONFLICT DO NOTHING;

-- Insert stores
INSERT INTO stores (
  name, address, city, phone, email,
  coordinates, hours, services, specialties, image_url, is_active
) VALUES
(
  'Abadan Haly Main Showroom',
  'Abadan district, Ashgabat',
  'Ashgabat',
  '+993 12 345-678',
  'main@abadanhaly.com.tm',
  '{"lat": 37.9601, "lng": 58.3261}'::jsonb,
  '{"weekdays": "9:00 - 19:00", "saturday": "9:00 - 18:00", "sunday": "10:00 - 17:00"}'::jsonb,
  ARRAY['Expert Consultation', 'AR Demonstrations', 'Custom Orders', 'Installation Service'],
  ARRAY['Premium Collection', 'Traditional Designs', 'Custom Sizing'],
  'https://abadanhaly.com.tm/storage/about/8214.png',
  true
),
(
  'Central District Store',
  'Central district, Ashgabat',
  'Ashgabat',
  '+993 12 345-679',
  'central@abadanhaly.com.tm',
  '{"lat": 37.9755, "lng": 58.3794}'::jsonb,
  '{"weekdays": "9:00 - 18:00", "saturday": "9:00 - 17:00", "sunday": "10:00 - 16:00"}'::jsonb,
  ARRAY['Product Display', 'Size Consultation', 'Delivery Service', 'Maintenance Support'],
  ARRAY['Modern Collection', 'Quick Service', 'Urban Designs'],
  'https://abadanhaly.com.tm/storage/about/8214.png',
  true
),
(
  'Berkararlyk Store',
  'Berkararlyk district, Ashgabat',
  'Ashgabat',
  '+993 12 345-680',
  'berkararlyk@abadanhaly.com.tm',
  '{"lat": 37.9200, "lng": 58.3500}'::jsonb,
  '{"weekdays": "9:00 - 18:00", "saturday": "9:00 - 17:00", "sunday": "Closed"}'::jsonb,
  ARRAY['Local Collection', 'Express Service', 'Repair & Cleaning', 'Home Consultation'],
  ARRAY['Classic Collection', 'Family Service', 'Local Expertise'],
  'https://abadanhaly.com.tm/storage/about/8214.png',
  true
)
ON CONFLICT DO NOTHING;