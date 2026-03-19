-- Seed fake teacher users
-- Safe to run multiple times (email is unique).
INSERT INTO "user" (
    id,
    name,
    email,
    email_verified,
    image,
    role,
    image_cld_pub_id,
    created_at,
    updated_at
)
VALUES
    ('tch_001', 'John Carter', 'john.carter@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_002', 'Emily Stone', 'emily.stone@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_003', 'Michael Reed', 'michael.reed@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_004', 'Sophia Hayes', 'sophia.hayes@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_005', 'Daniel Park', 'daniel.park@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_006', 'Ava Turner', 'ava.turner@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_007', 'Noah Bennett', 'noah.bennett@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_008', 'Olivia Brooks', 'olivia.brooks@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_009', 'Liam Foster', 'liam.foster@school.local', true, null, 'teacher', null, NOW(), NOW()),
    ('tch_010', 'Mia Sanders', 'mia.sanders@school.local', true, null, 'teacher', null, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
