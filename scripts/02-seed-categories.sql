-- Seed categories based on Sailor Clothing style
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Clothing', 'clothing', 'All clothing items', true, 1),
('Accessories', 'accessories', 'Fashion accessories', true, 2),
('Footwear', 'footwear', 'Shoes and boots', true, 3),
('Bags', 'bags', 'Handbags and backpacks', true, 4);

-- Subcategories for Clothing
INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
('T-Shirts', 't-shirts', 'Casual and designer t-shirts', 1, true, 1),
('Shirts', 'shirts', 'Dress shirts and casual shirts', 1, true, 2),
('Pants', 'pants', 'Jeans, chinos, and dress pants', 1, true, 3),
('Dresses', 'dresses', 'Casual and formal dresses', 1, true, 4),
('Jackets', 'jackets', 'Coats and jackets', 1, true, 5),
('Sweaters', 'sweaters', 'Knitwear and sweaters', 1, true, 6);

-- Subcategories for Accessories
INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
('Jewelry', 'jewelry', 'Rings, necklaces, and bracelets', 2, true, 1),
('Watches', 'watches', 'Fashion and luxury watches', 2, true, 2),
('Hats', 'hats', 'Caps, beanies, and hats', 2, true, 3),
('Belts', 'belts', 'Leather and fabric belts', 2, true, 4);
