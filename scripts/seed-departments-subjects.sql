-- Seed fake departments and subjects
-- Safe to run multiple times (unique codes + ON CONFLICT DO NOTHING).

INSERT INTO departments (code, name, description, created_at, updated_at)
VALUES
    ('CSE', 'Computer Science', 'Department of computing and software systems.', NOW(), NOW()),
    ('MTH', 'Mathematics', 'Department of pure and applied mathematics.', NOW(), NOW()),
    ('PHY', 'Physics', 'Department of theoretical and experimental physics.', NOW(), NOW()),
    ('CHM', 'Chemistry', 'Department of chemical sciences.', NOW(), NOW()),
    ('BIO', 'Biology', 'Department of life sciences.', NOW(), NOW()),
    ('ENG', 'English', 'Department of language and literature.', NOW(), NOW()),
    ('HIS', 'History', 'Department of historical studies.', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO subjects (department_id, name, code, description, created_at, updated_at)
VALUES
    ((SELECT id FROM departments WHERE code = 'CSE'), 'Introduction to Programming', 'CSE101', 'Basics of programming with problem-solving.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'CSE'), 'Data Structures', 'CSE201', 'Core data structures and algorithmic usage.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'CSE'), 'Database Systems', 'CSE301', 'Relational databases, SQL, and schema design.', NOW(), NOW()),

    ((SELECT id FROM departments WHERE code = 'MTH'), 'Calculus I', 'MTH101', 'Limits, derivatives, and integrals.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'MTH'), 'Linear Algebra', 'MTH201', 'Vectors, matrices, and linear transformations.', NOW(), NOW()),

    ((SELECT id FROM departments WHERE code = 'PHY'), 'General Physics I', 'PHY101', 'Mechanics, motion, and energy.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'PHY'), 'Electricity and Magnetism', 'PHY202', 'Electric fields, circuits, and magnetism.', NOW(), NOW()),

    ((SELECT id FROM departments WHERE code = 'CHM'), 'General Chemistry', 'CHM101', 'Atomic structure, bonding, and reactions.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'CHM'), 'Organic Chemistry', 'CHM210', 'Structure and reactions of organic compounds.', NOW(), NOW()),

    ((SELECT id FROM departments WHERE code = 'BIO'), 'Cell Biology', 'BIO110', 'Cell structure, function, and processes.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'BIO'), 'Genetics', 'BIO220', 'Inheritance, genes, and molecular genetics.', NOW(), NOW()),

    ((SELECT id FROM departments WHERE code = 'ENG'), 'Academic Writing', 'ENG101', 'Critical writing and academic communication.', NOW(), NOW()),
    ((SELECT id FROM departments WHERE code = 'HIS'), 'World History', 'HIS101', 'Major global historical periods and events.', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
