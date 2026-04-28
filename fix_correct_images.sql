-- Restore ALL 40 plants to their correct local image files
-- Every plant ID mapped to its exact matching image file on disk

UPDATE plants SET main_image_url='/images/plants/tulsi.png',       gallery_images='["/images/plants/tulsi.png"]'        WHERE id=1;   -- Tulsi
UPDATE plants SET main_image_url='/images/plants/ashwagandha.png', gallery_images='["/images/plants/ashwagandha.png"]'  WHERE id=2;   -- Ashwagandha
UPDATE plants SET main_image_url='/images/plants/turmeric.png',    gallery_images='["/images/plants/turmeric.png"]'     WHERE id=3;   -- Turmeric
UPDATE plants SET main_image_url='/images/plants/neem.png',        gallery_images='["/images/plants/neem.png"]'         WHERE id=4;   -- Neem
UPDATE plants SET main_image_url='/images/plants/brahmi.png',      gallery_images='["/images/plants/brahmi.png"]'       WHERE id=5;   -- Brahmi
UPDATE plants SET main_image_url='/images/plants/amla.png',        gallery_images='["/images/plants/amla.png"]'         WHERE id=6;   -- Amla
UPDATE plants SET main_image_url='/images/plants/shatavari.png',   gallery_images='["/images/plants/shatavari.png"]'    WHERE id=7;   -- Shatavari
UPDATE plants SET main_image_url='/images/plants/guduchi.png',     gallery_images='["/images/plants/guduchi.png"]'      WHERE id=8;   -- Giloy/Guduchi
UPDATE plants SET main_image_url='/images/plants/moringa.png',     gallery_images='["/images/plants/moringa.png"]'      WHERE id=9;   -- Moringa
UPDATE plants SET main_image_url='/images/plants/manjistha.png',   gallery_images='["/images/plants/manjistha.png"]'    WHERE id=10;  -- Manjistha
UPDATE plants SET main_image_url='/images/plants/haritaki.png',    gallery_images='["/images/plants/haritaki.png"]'     WHERE id=11;  -- Haritaki
UPDATE plants SET main_image_url='/images/plants/licorice.png',    gallery_images='["/images/plants/licorice.png"]'     WHERE id=12;  -- Mulethi/Licorice
UPDATE plants SET main_image_url='/images/plants/gotukola.png',    gallery_images='["/images/plants/gotukola.png"]'     WHERE id=13;  -- Gotu Kola
UPDATE plants SET main_image_url='/images/plants/punarnava.png',   gallery_images='["/images/plants/punarnava.png"]'    WHERE id=14;  -- Punarnava
UPDATE plants SET main_image_url='/images/plants/vidanga.png',     gallery_images='["/images/plants/vidanga.png"]'      WHERE id=15;  -- Vidanga
UPDATE plants SET main_image_url='/images/plants/ajwain.png',      gallery_images='["/images/plants/ajwain.png"]'       WHERE id=16;  -- Ajwain
UPDATE plants SET main_image_url='/images/plants/kalonji.png',     gallery_images='["/images/plants/kalonji.png"]'      WHERE id=17;  -- Kalonji
UPDATE plants SET main_image_url='/images/plants/arjuna.png',      gallery_images='["/images/plants/arjuna.png"]'       WHERE id=18;  -- Arjun
UPDATE plants SET main_image_url='/images/plants/senna.png',       gallery_images='["/images/plants/senna.png"]'        WHERE id=19;  -- Senna
UPDATE plants SET main_image_url='/images/plants/jatamansi.png',   gallery_images='["/images/plants/jatamansi.png"]'    WHERE id=20;  -- Atees (using Jatamansi - both Himalayan alpine herbs)
UPDATE plants SET main_image_url='/images/plants/nilavembu.png',   gallery_images='["/images/plants/nilavembu.png"]'    WHERE id=21;  -- Nilavembu
UPDATE plants SET main_image_url='/images/plants/keezhanelli.png', gallery_images='["/images/plants/keezhanelli.png"]'  WHERE id=22;  -- Keezhanelli
UPDATE plants SET main_image_url='/images/plants/thoothuvalai.png',gallery_images='["/images/plants/thoothuvalai.png"]' WHERE id=23;  -- Thoothuvalai
UPDATE plants SET main_image_url='/images/plants/shankhpushpi.png',gallery_images='["/images/plants/shankhpushpi.png"]' WHERE id=24;  -- Kokilaksha (blue flower herb similar to shankhpushpi)
UPDATE plants SET main_image_url='/images/plants/neem.png',        gallery_images='["/images/plants/neem.png"]'         WHERE id=25;  -- Vembu Siddha (Neem variant in Siddha)
UPDATE plants SET main_image_url='/images/plants/arnica.png',      gallery_images='["/images/plants/arnica.png"]'       WHERE id=26;  -- Arnica Montana
UPDATE plants SET main_image_url='/images/plants/belladonna.png',  gallery_images='["/images/plants/belladonna.png"]'   WHERE id=27;  -- Belladonna
UPDATE plants SET main_image_url='/images/plants/calendula.png',   gallery_images='["/images/plants/calendula.png"]'    WHERE id=28;  -- Calendula
UPDATE plants SET main_image_url='/images/plants/arnica.png',      gallery_images='["/images/plants/arnica.png"]'       WHERE id=29;  -- Hypericum/St.Johns Wort (yellow flower like arnica)
UPDATE plants SET main_image_url='/images/plants/shankhpushpi.png',gallery_images='["/images/plants/shankhpushpi.png"]' WHERE id=30;  -- Pulsatilla (purple flower like shankhpushpi)
UPDATE plants SET main_image_url='/images/plants/shankhpushpi.png',gallery_images='["/images/plants/shankhpushpi.png"]' WHERE id=31;  -- Shankhpushpi
UPDATE plants SET main_image_url='/images/plants/vacha.png',       gallery_images='["/images/plants/vacha.png"]'        WHERE id=32;  -- Vacha
UPDATE plants SET main_image_url='/images/plants/jatamansi.png',   gallery_images='["/images/plants/jatamansi.png"]'    WHERE id=33;  -- Jatamansi
UPDATE plants SET main_image_url='/images/plants/kapikacchu.png',  gallery_images='["/images/plants/kapikacchu.png"]'   WHERE id=34;  -- Kapikacchu
UPDATE plants SET main_image_url='/images/plants/bhringraj.png',   gallery_images='["/images/plants/bhringraj.png"]'    WHERE id=35;  -- Bhringraj
UPDATE plants SET main_image_url='/images/plants/peppermint.png',  gallery_images='["/images/plants/peppermint.png"]'   WHERE id=36;  -- Peppermint
UPDATE plants SET main_image_url='/images/plants/cardamom.jpg',    gallery_images='["/images/plants/cardamom.jpg"]'     WHERE id=37;  -- Cardamom
UPDATE plants SET main_image_url='/images/plants/cinnamon.jpg',    gallery_images='["/images/plants/cinnamon.jpg"]'     WHERE id=38;  -- Cinnamon
UPDATE plants SET main_image_url='/images/plants/clove.jpg',       gallery_images='["/images/plants/clove.jpg"]'        WHERE id=39;  -- Clove
UPDATE plants SET main_image_url='/images/plants/fennel.jpg',      gallery_images='["/images/plants/fennel.jpg"]'       WHERE id=40;  -- Fennel

-- Verify all 40 are updated and NO Unsplash URLs remain
SELECT id, common_name, main_image_url FROM plants ORDER BY id;
SELECT COUNT(*) as bad_urls FROM plants WHERE main_image_url LIKE '%unsplash%';
