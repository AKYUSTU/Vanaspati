-- 1. Add remedy for Hypericum (id=29) - St. John's Wort
INSERT INTO remedies (id, name, for_ailment, difficulty, prep_time_minutes, description, precautions)
VALUES (41, 'Hypericum Nerve Tonic Tea', 'Mild depression, nerve pain, anxiety', 'BEGINNER', 10,
'Steep 1 tsp dried Hypericum flowers in 250ml hot water for 10 minutes. Strain and drink warm. Take once or twice daily for mild mood support and nerve pain relief.',
'Avoid during pregnancy. May increase photosensitivity. Do not combine with antidepressants or blood thinners without medical advice.');

INSERT INTO remedy_plants (remedy_id, plant_id) VALUES (41, 29);

-- 2. Add remedy for Pulsatilla (id=30)
INSERT INTO remedies (id, name, for_ailment, difficulty, prep_time_minutes, description, precautions)
VALUES (42, 'Pulsatilla Homeopathic Tincture', 'Hormonal imbalance, PMS, emotional sensitivity', 'ADVANCED', 30,
'Pulsatilla is used in homeopathic potencies (6C, 30C). Dissolve 4 pellets under tongue 3 times daily for hormonal balance and emotional wellbeing. Consult a homeopath for correct potency.',
'Use only in homeopathic dilutions — the raw plant is toxic. Avoid self-prescribing. Not for children without practitioner guidance.');

INSERT INTO remedy_plants (remedy_id, plant_id) VALUES (42, 30);

-- Verify all 40 plants now have remedies
SELECT 'Plants with 0 remedies:' as check_result;
SELECT p.id, p.common_name FROM plants p 
LEFT JOIN remedy_plants rp ON p.id=rp.plant_id 
WHERE rp.remedy_id IS NULL AND p.is_active=1 ORDER BY p.id;
SELECT 'Total remedy links:', COUNT(*) FROM remedy_plants;
