-- Seed data for Montessori Bloom SMS
-- Run AFTER 001_schema.sql
-- Default password for ALL seed users: Password123!
-- Passwords are hashed with pgcrypto blowfish (bcrypt-compatible).

DO $$
DECLARE
  pwd TEXT := crypt('Password123!', gen_salt('bf', 10));
  principal_id UUID;
  teacher1_id UUID;
  teacher2_id UUID;
  security_id UUID;
  accountant_id UUID;
  parent1_id UUID;
  parent2_id UUID;
  t1_row UUID;
  t2_row UUID;
  sec_row UUID;
  acc_row UUID;
  p1_row UUID;
  p2_row UUID;
  course_math UUID;
  course_eng UUID;
  course_sci UUID;
  course_art UUID;
  class_tod UUID;
  class_pri UUID;
  class_elem UUID;
  s1 UUID;
  s2 UUID;
  s3 UUID;
  s4 UUID;
  year_id UUID;
  prod1 UUID;
  prod2 UUID;
  prod3 UUID;
BEGIN
  -- Users
  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'principal@montessoribloom.edu', pwd, 'PRINCIPAL', 'Dr. Ama Mensah', '+233201000001')
  RETURNING id INTO principal_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'teacher1@montessoribloom.edu', pwd, 'TEACHER', 'Kwame Asante', '+233201000002')
  RETURNING id INTO teacher1_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'teacher2@montessoribloom.edu', pwd, 'TEACHER', 'Efua Boateng', '+233201000003')
  RETURNING id INTO teacher2_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'security@montessoribloom.edu', pwd, 'SECURITY', 'Kofi Gatekeeper', '+233201000004')
  RETURNING id INTO security_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'accountant@montessoribloom.edu', pwd, 'ACCOUNTANT', 'Abena Finance', '+233201000005')
  RETURNING id INTO accountant_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'parent1@example.com', pwd, 'PARENT', 'Mr. John Osei', '+233201000006')
  RETURNING id INTO parent1_id;

  INSERT INTO profiles (id, email, password_hash, role, name, phone)
  VALUES
    (gen_random_uuid(), 'parent2@example.com', pwd, 'PARENT', 'Mrs. Sarah Addo', '+233201000007')
  RETURNING id INTO parent2_id;

  INSERT INTO principals (user_id) VALUES (principal_id);
  INSERT INTO teachers (user_id, employee_id) VALUES (teacher1_id, 'TCH-001') RETURNING id INTO t1_row;
  INSERT INTO teachers (user_id, employee_id) VALUES (teacher2_id, 'TCH-002') RETURNING id INTO t2_row;
  INSERT INTO security_staff (user_id, badge_number) VALUES (security_id, 'SEC-001') RETURNING id INTO sec_row;
  INSERT INTO accountants (user_id) VALUES (accountant_id) RETURNING id INTO acc_row;
  INSERT INTO parents (user_id) VALUES (parent1_id) RETURNING id INTO p1_row;
  INSERT INTO parents (user_id) VALUES (parent2_id) RETURNING id INTO p2_row;

  -- Courses
  INSERT INTO courses (name, code, description) VALUES
    ('Mathematics', 'MATH101', 'Number sense and practical math')
  RETURNING id INTO course_math;
  INSERT INTO courses (name, code, description) VALUES
    ('English Language', 'ENG101', 'Reading, writing, oral language')
  RETURNING id INTO course_eng;
  INSERT INTO courses (name, code, description) VALUES
    ('Science', 'SCI101', 'Nature and discovery science')
  RETURNING id INTO course_sci;
  INSERT INTO courses (name, code, description) VALUES
    ('Art & Culture', 'ART101', 'Creative expression')
  RETURNING id INTO course_art;

  -- Classes
  INSERT INTO classes (name, form_teacher_id) VALUES ('Toddler House', t1_row) RETURNING id INTO class_tod;
  INSERT INTO classes (name, form_teacher_id) VALUES ('Primary House', t1_row) RETURNING id INTO class_pri;
  INSERT INTO classes (name, form_teacher_id) VALUES ('Elementary House', t2_row) RETURNING id INTO class_elem;

  -- Teacher course assignments
  INSERT INTO teacher_courses (teacher_id, course_id) VALUES
    (t1_row, course_math),
    (t1_row, course_eng),
    (t2_row, course_sci),
    (t2_row, course_art),
    (t2_row, course_math);

  INSERT INTO class_courses (class_id, course_id) VALUES
    (class_tod, course_eng),
    (class_tod, course_art),
    (class_pri, course_math),
    (class_pri, course_eng),
    (class_pri, course_sci),
    (class_elem, course_math),
    (class_elem, course_eng),
    (class_elem, course_sci),
    (class_elem, course_art);

  -- Students
  INSERT INTO students (first_name, last_name, date_of_birth, student_id, class_id, parent_id)
  VALUES ('Ama', 'Osei', '2019-03-12', 'MBS-2024-001', class_pri, p1_row) RETURNING id INTO s1;
  INSERT INTO students (first_name, last_name, date_of_birth, student_id, class_id, parent_id)
  VALUES ('Kwesi', 'Osei', '2017-08-21', 'MBS-2024-002', class_elem, p1_row) RETURNING id INTO s2;
  INSERT INTO students (first_name, last_name, date_of_birth, student_id, class_id, parent_id)
  VALUES ('Akosua', 'Addo', '2018-11-05', 'MBS-2024-003', class_pri, p2_row) RETURNING id INTO s3;
  INSERT INTO students (first_name, last_name, date_of_birth, student_id, class_id, parent_id)
  VALUES ('Yaw', 'Addo', '2021-01-18', 'MBS-2024-004', class_tod, p2_row) RETURNING id INTO s4;

  -- Academic year
  INSERT INTO academic_years (name, start_date, end_date, is_current)
  VALUES ('2025/2026', '2025-09-01', '2026-07-31', true)
  RETURNING id INTO year_id;

  INSERT INTO academic_terms (academic_year_id, name, start_date, end_date) VALUES
    (year_id, 'Term 1', '2025-09-01', '2025-12-15'),
    (year_id, 'Term 2', '2026-01-10', '2026-04-05'),
    (year_id, 'Term 3', '2026-04-20', '2026-07-31');

  -- Attendance samples
  INSERT INTO student_attendance (student_id, class_id, date, status, marked_by) VALUES
    (s1, class_pri, CURRENT_DATE, 'PRESENT', teacher1_id),
    (s3, class_pri, CURRENT_DATE, 'LATE', teacher1_id),
    (s2, class_elem, CURRENT_DATE, 'PRESENT', teacher2_id),
    (s4, class_tod, CURRENT_DATE, 'PRESENT', teacher1_id),
    (s1, class_pri, CURRENT_DATE - 1, 'PRESENT', teacher1_id),
    (s3, class_pri, CURRENT_DATE - 1, 'ABSENT', teacher1_id);

  -- Performance
  INSERT INTO performances (student_id, course_id, assessment_type, score, max_score, term, academic_year, recorded_by) VALUES
    (s1, course_math, 'Quiz 1', 85, 100, 'Term 1', '2025/2026', teacher1_id),
    (s1, course_eng, 'Quiz 1', 78, 100, 'Term 1', '2025/2026', teacher1_id),
    (s3, course_math, 'Quiz 1', 92, 100, 'Term 1', '2025/2026', teacher1_id),
    (s2, course_sci, 'Project', 88, 100, 'Term 1', '2025/2026', teacher2_id),
    (s2, course_math, 'Quiz 1', 74, 100, 'Term 1', '2025/2026', teacher2_id);

  -- Fees
  INSERT INTO fees (student_id, amount, due_date, paid, paid_date, academic_term, academic_year, description) VALUES
    (s1, 2500, '2025-09-30', true, '2025-09-10', 'Term 1', '2025/2026', 'Tuition Term 1'),
    (s2, 2800, '2025-09-30', true, '2025-09-12', 'Term 1', '2025/2026', 'Tuition Term 1'),
    (s3, 2500, '2025-09-30', false, NULL, 'Term 1', '2025/2026', 'Tuition Term 1'),
    (s4, 2000, '2025-09-30', false, NULL, 'Term 1', '2025/2026', 'Tuition Term 1');

  INSERT INTO financial_transactions (type, amount, description, date, recorded_by, student_id) VALUES
    ('FEE_PAYMENT', 2500, 'Tuition payment - Ama Osei', '2025-09-10', accountant_id, s1),
    ('FEE_PAYMENT', 2800, 'Tuition payment - Kwesi Osei', '2025-09-12', accountant_id, s2),
    ('INCOME', 500, 'Donation - PTA fundraiser', '2025-09-15', accountant_id, NULL),
    ('EXPENSE', 1200, 'Classroom materials', '2025-09-18', accountant_id, NULL);

  -- Products
  INSERT INTO products (name, description, category, price, stock, image_url) VALUES
    ('School Uniform Set', 'Complete Montessori Bloom uniform', 'ATTIRE', 350, 40, '/placeholder.svg')
  RETURNING id INTO prod1;
  INSERT INTO products (name, description, category, price, stock, image_url) VALUES
    ('Montessori Workbook', 'Primary level practice book', 'BOOK', 85, 100, '/placeholder.svg')
  RETURNING id INTO prod2;
  INSERT INTO products (name, description, category, price, stock, image_url) VALUES
    ('School Bag', 'Branded canvas school bag', 'OTHER', 150, 25, '/placeholder.svg')
  RETURNING id INTO prod3;

  -- Sample order
  INSERT INTO orders (parent_id, total_amount, status)
  VALUES (p1_row, 435, 'PAID');

  INSERT INTO order_items (order_id, product_id, quantity, price)
  SELECT o.id, prod1, 1, 350 FROM orders o WHERE o.parent_id = p1_row LIMIT 1;
  INSERT INTO order_items (order_id, product_id, quantity, price)
  SELECT o.id, prod2, 1, 85 FROM orders o WHERE o.parent_id = p1_row LIMIT 1;

  -- Visitor logs
  INSERT INTO visitor_logs (visitor_name, visitor_phone, purpose, person_to_see, recorded_by) VALUES
    ('Nana Yaw', '+233244111222', 'Parent meeting', 'Kwame Asante', security_id),
    ('Delivery Rider', '+233244333444', 'Package delivery', 'Front office', security_id);

  INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, resource, severity, details)
  VALUES (principal_id, 'principal@montessoribloom.edu', 'PRINCIPAL', 'SEED', 'database', 'INFO', '{"message":"Initial seed completed"}'::jsonb);
END $$;
