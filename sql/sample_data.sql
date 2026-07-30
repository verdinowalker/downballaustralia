-- sample data for initial setup

-- Insert a competition
INSERT INTO competitions (id, name, slug, description)
VALUES (
  gen_random_uuid(),
  'Downball World Cup',
  'downball-world-cup',
  'Premier international downball tournament'
);

-- Sample venue
INSERT INTO venues (id, name, city, country)
VALUES (gen_random_uuid(), 'Melbourne Arena', 'Melbourne', 'Australia');

-- Sample sponsor
INSERT INTO sponsors (id, name, tier)
VALUES (gen_random_uuid(), 'Sample Sponsor', 'gold');
