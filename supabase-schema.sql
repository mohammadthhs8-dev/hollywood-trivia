-- Supabase SQL Schema for Hollywood Trivia
-- Run this in your Supabase SQL Editor to set up the database

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  total_answered INTEGER NOT NULL,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created ON leaderboard(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Allow anyone to insert scores (for anonymous play)
CREATE POLICY "Anyone can submit scores" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- Optional: Create a view for top 10 scores
CREATE OR REPLACE VIEW top_scores AS
SELECT 
  name,
  score,
  total_answered,
  best_streak,
  ROUND((score::DECIMAL / total_answered) * 100, 1) as accuracy,
  created_at
FROM leaderboard
ORDER BY score DESC, best_streak DESC
LIMIT 10;

-- Optional: Function to clean up old scores (keep top 100)
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS void AS $$
BEGIN
  DELETE FROM leaderboard
  WHERE id NOT IN (
    SELECT id FROM leaderboard
    ORDER BY score DESC, created_at DESC
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql;
