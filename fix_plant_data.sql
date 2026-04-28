-- ============================================================
-- FIX: Plants 36-40 missing parts_used, rasa, body_parts
-- FIX: Remedies 35-40 missing plant links (remedy_plants)
-- FIX: Minor data corrections
-- ============================================================

-- === PLANTS: Fill missing fields for Peppermint, Cardamom, Cinnamon, Clove, Fennel ===

UPDATE plants SET
  parts_used = 'Leaf, essential oil',
  rasa = 'Pungent, Sweet',
  body_parts = '["STOMACH", "CHEST", "HEAD"]',
  native_region = 'Europe and Middle East',
  precautions = 'Avoid in infants under 2 years. High doses may cause heartburn.'
WHERE id = 36; -- Peppermint

UPDATE plants SET
  parts_used = 'Seed pod',
  rasa = 'Pungent, Sweet',
  body_parts = '["STOMACH", "THROAT", "CHEST"]',
  native_region = 'Southern India',
  precautions = 'Safe in culinary doses. Avoid large medicinal amounts in pregnancy.'
WHERE id = 37; -- Cardamom

UPDATE plants SET
  parts_used = 'Bark',
  rasa = 'Sweet, Pungent',
  body_parts = '["STOMACH", "LIVER", "HEART"]',
  native_region = 'Sri Lanka, India',
  precautions = 'Avoid cassia cinnamon in large doses due to coumarin content. Prefer Ceylon variety.'
WHERE id = 38; -- Cinnamon

UPDATE plants SET
  parts_used = 'Flower bud, essential oil',
  rasa = 'Pungent',
  body_parts = '["THROAT", "STOMACH", "HEAD"]',
  native_region = 'Indonesia (Maluku Islands)',
  precautions = 'Clove oil is very potent — dilute before topical use. Avoid undiluted application on gums.'
WHERE id = 39; -- Clove

UPDATE plants SET
  parts_used = 'Seed, leaf',
  rasa = 'Sweet, Pungent',
  body_parts = '["STOMACH", "KIDNEYS"]',
  native_region = 'Mediterranean',
  precautions = 'Safe in normal use. Excessive doses may cause hormonal effects in sensitive individuals.'
WHERE id = 40; -- Fennel

-- === REMEDIES 35-40: Link to correct plants ===
-- Remedy 35: Moringa Vitality Tea -> Moringa (id=9)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (35, 9);
-- Remedy 36: Kalonji Black Seed Honey -> Kalonji (id=17)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (36, 17);
-- Remedy 37: Shankhpushpi Memory Milk -> Shankhpushpi (id=31)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (37, 31);
-- Remedy 38: Nilavembu Fever Decoction -> Nilavembu (id=21)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (38, 21);
-- Remedy 39: Vacha Digestive Powder -> Vacha (id=32)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (39, 32);
-- Remedy 40: Jatamansi Stress Relief Oil -> Jatamansi (id=33)
INSERT IGNORE INTO remedy_plants (remedy_id, plant_id) VALUES (40, 33);

-- === MINOR DATA FIXES ===
-- Arnica Montana: fix native region (it's a European alpine plant, not Indian highlands)
UPDATE plants SET native_region='European Alps and mountain meadows' WHERE id=26;
-- Belladonna: fix native region
UPDATE plants SET native_region='Europe and Western Asia' WHERE id=27;
-- Calendula: fix native region
UPDATE plants SET native_region='Southern Europe and Mediterranean' WHERE id=28;
-- Hypericum: fix native region
UPDATE plants SET native_region='Europe, Western Asia' WHERE id=29;
-- Pulsatilla: fix scientific name (nigricans = black, correct species for Homeopathy is vulgaris)
UPDATE plants SET scientific_name='Pulsatilla vulgaris', native_region='Europe and temperate Asia' WHERE id=30;
-- Fennel: fix native region label
UPDATE plants SET native_region='Mediterranean, cultivated across India' WHERE id=40;

-- === VERIFY final state ===
SELECT id, common_name, scientific_name,
       CASE WHEN parts_used IS NULL THEN 'MISSING' ELSE 'OK' END as parts_ok,
       CASE WHEN rasa IS NULL THEN 'MISSING' ELSE 'OK' END as rasa_ok,
       CASE WHEN body_parts IS NULL THEN 'MISSING' ELSE 'OK' END as body_ok
FROM plants WHERE is_active=1 ORDER BY id;

SELECT 'Remedies now linked to plants:' as info;
SELECT r.id, r.name, GROUP_CONCAT(p.common_name SEPARATOR ', ') as plants
FROM remedies r LEFT JOIN remedy_plants rp ON r.id=rp.remedy_id LEFT JOIN plants p ON p.id=rp.plant_id
GROUP BY r.id, r.name ORDER BY r.id;
