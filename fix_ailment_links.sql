-- =====================================================
-- Fix 1: Add comprehensive plant_ailments links
-- Ailment IDs: 1=Fever, 2=Digestion, 3=Immunity, 4=Skin Care,
--              5=Stress/Anxiety, 6=Diabetes, 7=Joint Pain, 8=Respiratory,
--              9=Better Sleep, 10=Hair Growth, 11=Eye Care,
--              12=Memory/Focus, 13=Liver Support, 14=Kidney Support, 15=Heart Health
-- =====================================================

INSERT IGNORE INTO plant_ailments (plant_id, ailment_id) VALUES
-- Tulsi (1): Fever, Immunity, Respiratory
(1, 1), (1, 3), (1, 8),
-- Ashwagandha (2): Stress, Sleep, Immunity, Diabetes
(2, 5), (2, 9), (2, 3), (2, 6),
-- Turmeric (3): Skin Care, Joint Pain, Immunity, Liver
(3, 4), (3, 7), (3, 3), (3, 13),
-- Neem (4): Skin Care, Diabetes, Immunity
(4, 4), (4, 6), (4, 3),
-- Brahmi (5): Memory/Focus, Stress, Better Sleep
(5, 12), (5, 5), (5, 9),
-- Amla (6): Immunity, Digestion, Hair Growth, Eye Care
(6, 3), (6, 2), (6, 10), (6, 11),
-- Shatavari (7): Stress, Better Sleep, Immunity
(7, 5), (7, 9), (7, 3),
-- Giloy (8): Fever, Immunity, Liver
(8, 1), (8, 3), (8, 13),
-- Moringa (9): Immunity, Digestion, Diabetes, Joint Pain
(9, 3), (9, 2), (9, 6), (9, 7),
-- Manjistha (10): Skin Care, Liver, Heart
(10, 4), (10, 13), (10, 15),
-- Haritaki (11): Digestion, Liver, Immunity
(11, 2), (11, 13), (11, 3),
-- Mulethi (12): Respiratory, Digestion, Immunity
(12, 8), (12, 2), (12, 3),
-- Gotu Kola (13): Memory/Focus, Skin Care, Stress
(13, 12), (13, 4), (13, 5),
-- Punarnava (14): Kidney Support, Liver, Heart
(14, 14), (14, 13), (14, 15),
-- Vidanga (15): Digestion, Liver
(15, 2), (15, 13),
-- Ajwain (16): Digestion, Respiratory
(16, 2), (16, 8),
-- Kalonji (17): Immunity, Respiratory, Diabetes
(17, 3), (17, 8), (17, 6),
-- Arjun (18): Heart Health, Stress
(18, 15), (18, 5),
-- Senna (19): Digestion
(19, 2),
-- Atees (20): Fever, Digestion
(20, 1), (20, 2),
-- Nilavembu (21): Fever, Immunity, Liver
(21, 1), (21, 3), (21, 13),
-- Keezhanelli (22): Liver, Kidney
(22, 13), (22, 14),
-- Thoothuvalai (23): Respiratory, Fever
(23, 8), (23, 1),
-- Kokilaksha (24): Kidney, Joint Pain
(24, 14), (24, 7),
-- Vembu Siddha (25): Skin Care, Liver, Diabetes
(25, 4), (25, 13), (25, 6),
-- Arnica Montana (26): Joint Pain, Skin Care
(26, 7), (26, 4),
-- Belladonna (27): Fever, Stress
(27, 1), (27, 5),
-- Calendula (28): Skin Care, Immunity
(28, 4), (28, 3),
-- Hypericum (29): Stress, Better Sleep, Joint Pain
(29, 5), (29, 9), (29, 7),
-- Pulsatilla (30): Stress, Better Sleep
(30, 5), (30, 9),
-- Shankhpushpi (31): Memory/Focus, Stress, Better Sleep
(31, 12), (31, 5), (31, 9),
-- Vacha (32): Memory/Focus, Digestion
(32, 12), (32, 2),
-- Jatamansi (33): Stress, Better Sleep, Memory/Focus
(33, 5), (33, 9), (33, 12),
-- Kapikacchu (34): Stress, Memory/Focus
(34, 5), (34, 12),
-- Bhringraj (35): Hair Growth, Liver, Better Sleep
(35, 10), (35, 13), (35, 9),
-- Peppermint (36): Digestion, Respiratory
(36, 2), (36, 8),
-- Cardamom (37): Digestion, Respiratory
(37, 2), (37, 8),
-- Cinnamon (38): Diabetes, Digestion, Heart
(38, 6), (38, 2), (38, 15),
-- Clove (39): Digestion, Respiratory, Joint Pain
(39, 2), (39, 8), (39, 7),
-- Fennel (40): Digestion, Kidney, Stress
(40, 2), (40, 14), (40, 5);

-- Verify coverage
SELECT 'Total plant_ailments links' as info, COUNT(*) as count FROM plant_ailments;
SELECT ac.name, COUNT(pa.plant_id) as plant_count 
FROM ailment_categories ac 
LEFT JOIN plant_ailments pa ON pa.ailment_id = ac.id 
GROUP BY ac.id, ac.name ORDER BY plant_count DESC;
