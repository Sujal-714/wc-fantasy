-- Update default for new teams
ALTER TABLE teams ALTER COLUMN budget_remaining SET DEFAULT 120.0;

-- Update existing teams that still have 100 budget
UPDATE teams SET budget_remaining = 120.0 WHERE budget_remaining = 100.0;