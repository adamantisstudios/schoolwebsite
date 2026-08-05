-- Optional: verify setup after seeding
-- Run in Supabase SQL Editor

SELECT role, email, name, is_active FROM profiles ORDER BY role, email;

SELECT c.name AS class, COUNT(s.id) AS students
FROM classes c
LEFT JOIN students s ON s.class_id = c.id
GROUP BY c.name
ORDER BY c.name;

SELECT COUNT(*) AS products FROM products;
SELECT COUNT(*) AS fees FROM fees;
SELECT COUNT(*) AS visitors FROM visitor_logs;
