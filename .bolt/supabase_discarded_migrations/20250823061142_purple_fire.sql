/*
  # Sample Data for Abadan Haly Carpet Store

  1. Categories
    - Traditional, Modern, Classic carpet categories

  2. Sample Products
    - Featured carpets with multiple images
    - Different sizes and pricing
    - Rich product information

  3. Store Locations
    - Ashgabat showrooms with full details
    - Contact information and services

  4. Sample Inventory
    - Stock levels for each store
*/

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Traditional', 'traditional', 'Classic Turkmen and Persian designs with traditional patterns', 1, true),
('Modern', 'modern', 'Contemporary designs for modern living spaces', 2, true),
('Classic', 'classic', 'Timeless designs that never go out of style', 3, true),
('Premium', 'premium', 'Luxury collection with finest materials and craftsmanship', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  name, slug, description, category_id, base_price, sale_price, sku, 
  material, knot_density, pile_height, features, sizes, colors, is_featured, is_active
) VALUES
(
  'Persian Heritage Classic',
  'persian-heritage-classic',
  'Experience the timeless beauty of traditional Persian craftsmanship. This exquisite carpet features intricate patterns and rich colors that have been passed down through generations of master weavers.',
  (SELECT id FROM categories WHERE slug = 'traditional'),
  1599.00,
  1299.00,
  'AH-PHC-001',
  'Premium Polypropylene',
  '450 knots/m²',
  '15mm',
  ARRAY['Hand-selected premium fibers', 'Traditional Persian patterns', 'Fade-resistant colors', 'Anti-slip backing', 'Easy maintenance'],
  '[
    {"size": "140x200", "price": 899},
    {"size": "160x230", "price": 1099},
    {"size": "200x300", "price": 1299},
    {"size": "250x350", "price": 1599}
  ]'::jsonb,
  ARRAY['Burgundy & Gold', 'Navy & Cream', 'Forest & Beige'],
  true,
  true
),
(
  'Contemporary Wave',
  'contemporary-wave',
  'Modern geometric patterns that bring sophistication to any contemporary space. Clean lines and subtle color variations create a perfect balance of style and elegance.',
  (SELECT id FROM categories WHERE slug = 'modern'),
  1050.00,
  899.00,
  'AH-CW-002',
  'Premium Polypropylene',
  '380 knots/m²',
  '12mm',
  ARRAY['Modern geometric design', 'Neutral color palette', 'Stain-resistant treatment', 'Low maintenance'],
  '[
    {"size": "140x200", "price": 649},
    {"size": "160x230", "price": 799},
    {"size": "200x300", "price": 899},
    {"size": "250x350", "price": 1050}
  ]'::jsonb,
  ARRAY['Charcoal & Silver', 'Cream & Gray', 'Blue & White'],
  true,
  true
),
(
  'Royal Palace Design',
  'royal-palace-design',
  'Inspired by the grandeur of royal palaces, this carpet features elaborate medallion patterns and rich, deep colors that command attention and respect.',
  (SELECT id FROM categories WHERE slug = 'classic'),
  1899.00,
  1599.00,
  'AH-RPD-003',
  'Premium Polypropylene',
  '500 knots/m²',
  '18mm',
  ARRAY['Royal medallion design', 'Luxurious deep pile', 'Premium materials', 'Heirloom quality'],
  '[
    {"size": "200x300", "price": 1599},
    {"size": "250x350", "price": 1899},
    {"size": "300x400", "price": 2299}
  ]'::jsonb,
  ARRAY['Royal Blue & Gold', 'Burgundy & Cream', 'Emerald & Silver'],
  true,
  true
),
(
  'Minimalist Lines',
  'minimalist-lines',
  'Clean, simple lines for the modern minimalist. This carpet adds warmth without overwhelming your carefully curated space.',
  (SELECT id FROM categories WHERE slug = 'modern'),
  749.00,
  649.00,
  'AH-ML-004',
  'Premium Polypropylene',
  '320 knots/m²',
  '10mm',
  ARRAY['Minimalist design', 'Neutral tones', 'Easy to clean', 'Versatile styling'],
  '[
    {"size": "140x200", "price": 549},
    {"size": "160x230", "price": 649},
    {"size": "200x300", "price": 749}
  ]'::jsonb,
  ARRAY['Light Gray', 'Cream', 'Charcoal'],
  false,
  true
),
(
  'Vintage Medallion',
  'vintage-medallion',
  'A beautiful vintage-inspired design that brings character and warmth to any room. The distressed finish gives it an authentic aged appearance.',
  (SELECT id FROM categories WHERE slug = 'classic'),
  1399.00,
  1199.00,
  'AH-VM-005',
  'Premium Polypropylene',
  '420 knots/m²',
  '14mm',
  ARRAY['Vintage distressed finish', 'Central medallion design', 'Aged appearance', 'Durable construction'],
  '[
    {"size": "160x230", "price": 999},
    {"size": "200x300", "price": 1199},
    {"size": "250x350", "price": 1399}
  ]'::jsonb,
  ARRAY['Antique Gold', 'Faded Blue', 'Weathered Red'],
  false,
  true
),
(
  'Luxury Silk Touch',
  'luxury-silk-touch',
  'Our premium collection masterpiece. This carpet combines the finest materials with exceptional craftsmanship to create a truly luxurious experience.',
  (SELECT id FROM categories WHERE slug = 'premium'),
  2499.00,
  2199.00,
  'AH-LST-006',
  'Premium Polypropylene with Silk-like Finish',
  '600 knots/m²',
  '20mm',
  ARRAY['Silk-like finish', 'Ultra-high density', 'Luxury materials', 'Museum quality'],
  '[
    {"size": "200x300", "price": 2199},
    {"size": "250x350", "price": 2499},
    {"size": "300x400", "price": 2999}
  ]'::jsonb,
  ARRAY['Platinum & Gold', 'Sapphire & Silver', 'Ruby & Cream'],
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
-- Persian Heritage Classic images
((SELECT id FROM products WHERE slug = 'persian-heritage-classic'), 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800', 'Persian Heritage Classic - Main View', 1, true),
((SELECT id FROM products WHERE slug = 'persian-heritage-classic'), 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=800', 'Persian Heritage Classic - Detail View', 2, false),
((SELECT id FROM products WHERE slug = 'persian-heritage-classic'), 'https://images.pexels.com/photos/6782589/pexels-photo-6782589.jpeg?auto=compress&cs=tinysrgb&w=800', 'Persian Heritage Classic - Room Setting', 3, false),

-- Contemporary Wave images
((SELECT id FROM products WHERE slug = 'contemporary-wave'), 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=800', 'Contemporary Wave - Main View', 1, true),
((SELECT id FROM products WHERE slug = 'contemporary-wave'), 'https://images.pexels.com/photos/6782568/pexels-photo-6782568.jpeg?auto=compress&cs=tinysrgb&w=800', 'Contemporary Wave - Detail View', 2, false),

-- Royal Palace Design images
((SELECT id FROM products WHERE slug = 'royal-palace-design'), 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=800', 'Royal Palace Design - Main View', 1, true),
((SELECT id FROM products WHERE slug = 'royal-palace-design'), 'https://images.pexels.com/photos/6782569/pexels-photo-6782569.jpeg?auto=compress&cs=tinysrgb&w=800', 'Royal Palace Design - Detail View', 2, false),

-- Minimalist Lines images
((SELECT id FROM products WHERE slug = 'minimalist-lines'), 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=800', 'Minimalist Lines - Main View', 1, true),

-- Vintage Medallion images
((SELECT id FROM products WHERE slug = 'vintage-medallion'), 'https://images.pexels.com/photos/6969835/pexels-photo-6969835.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vintage Medallion - Main View', 1, true),

-- Luxury Silk Touch images
((SELECT id FROM products WHERE slug = 'luxury-silk-touch'), 'https://images.pexels.com/photos/6969836/pexels-photo-6969836.jpeg?auto=compress&cs=tinysrgb&w=800', 'Luxury Silk Touch - Main View', 1, true)
ON CONFLICT DO NOTHING;

-- Insert store locations
INSERT INTO stores (
  name, address, city, phone, email, coordinates, hours, services, specialties, image_url, is_active
) VALUES
(
  'Abadan Haly Main Showroom',
  'Abadan district, Ashgabat',
  'Ashgabat',
  '+993 12 345-678',
  'main@abadanhaly.com.tm',
  '{"lat": 37.9601, "lng": 58.3261}'::jsonb,
  '{
    "weekdays": "9:00 - 19:00",
    "saturday": "9:00 - 18:00", 
    "sunday": "10:00 - 17:00"
  }'::jsonb,
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
  '{
    "weekdays": "9:00 - 18:00",
    "saturday": "9:00 - 17:00",
    "sunday": "10:00 - 16:00"
  }'::jsonb,
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
  '{
    "weekdays": "9:00 - 18:00",
    "saturday": "9:00 - 17:00",
    "sunday": "Closed"
  }'::jsonb,
  ARRAY['Local Collection', 'Express Service', 'Repair & Cleaning', 'Home Consultation'],
  ARRAY['Classic Collection', 'Family Service', 'Local Expertise'],
  'https://abadanhaly.com.tm/storage/about/8214.png',
  true
)
ON CONFLICT DO NOTHING;

-- Insert sample inventory
INSERT INTO inventory (product_id, store_id, size_info, quantity) VALUES
-- Main Showroom inventory
((SELECT id FROM products WHERE slug = 'persian-heritage-classic'), (SELECT id FROM stores WHERE name = 'Abadan Haly Main Showroom'), '{"size": "200x300", "price": 1299}'::jsonb, 8),
((SELECT id FROM products WHERE slug = 'contemporary-wave'), (SELECT id FROM stores WHERE name = 'Abadan Haly Main Showroom'), '{"size": "160x230", "price": 799}'::jsonb, 12),
((SELECT id FROM products WHERE slug = 'royal-palace-design'), (SELECT id FROM stores WHERE name = 'Abadan Haly Main Showroom'), '{"size": "250x350", "price": 1899}'::jsonb, 5),

-- Central District inventory
((SELECT id FROM products WHERE slug = 'persian-heritage-classic'), (SELECT id FROM stores WHERE name = 'Central District Store'), '{"size": "200x300", "price": 1299}'::jsonb, 3),
((SELECT id FROM products WHERE slug = 'minimalist-lines'), (SELECT id FROM stores WHERE name = 'Central District Store'), '{"size": "160x230", "price": 649}'::jsonb, 15),

-- Berkararlyk Store inventory
((SELECT id FROM products WHERE slug = 'vintage-medallion'), (SELECT id FROM stores WHERE name = 'Berkararlyk Store'), '{"size": "200x300", "price": 1199}'::jsonb, 7),
((SELECT id FROM products WHERE slug = 'luxury-silk-touch'), (SELECT id FROM stores WHERE name = 'Berkararlyk Store'), '{"size": "250x350", "price": 2499}'::jsonb, 2)
ON CONFLICT DO NOTHING;