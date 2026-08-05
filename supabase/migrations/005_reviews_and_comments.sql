-- Run AFTER 001_schema.sql (and 002_seed.sql if already applied)
-- Adds teacher comments on grades + narrative student reviews

ALTER TABLE performances ADD COLUMN IF NOT EXISTS teacher_comment TEXT;

CREATE TABLE IF NOT EXISTS student_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id     UUID REFERENCES courses(id) ON DELETE SET NULL,
  term          TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  review_text   TEXT NOT NULL,
  recorded_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, term, academic_year, recorded_by)
);

CREATE INDEX IF NOT EXISTS idx_student_reviews_student ON student_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_student_reviews_term ON student_reviews(term);

ALTER TABLE student_reviews ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE student_reviews IS 'Teacher narrative reviews/comments per student per term.';
