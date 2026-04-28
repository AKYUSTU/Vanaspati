-- Fix existing plants: correct filename extensions + JSON array format for gallery_images
UPDATE plants SET main_image_url='/images/plants/tulsi.png',     gallery_images='["/images/plants/tulsi.png"]'       WHERE id=1;
UPDATE plants SET main_image_url='/images/plants/ashwagandha.png', gallery_images='["/images/plants/ashwagandha.png"]' WHERE id=2;
UPDATE plants SET main_image_url='/images/plants/turmeric.png',  gallery_images='["/images/plants/turmeric.png"]'    WHERE id=3;
UPDATE plants SET main_image_url='/images/plants/neem.png',      gallery_images='["/images/plants/neem.png"]'        WHERE id=4;
UPDATE plants SET main_image_url='/images/plants/brahmi.png',    gallery_images='["/images/plants/brahmi.png"]'      WHERE id=5;
UPDATE plants SET main_image_url='/images/plants/amla.png',      gallery_images='["/images/plants/amla.png"]'        WHERE id=6;
UPDATE plants SET main_image_url='/images/plants/shatavari.png', gallery_images='["/images/plants/shatavari.png"]'   WHERE id=7;
UPDATE plants SET main_image_url='/images/plants/guduchi.png',   gallery_images='["/images/plants/guduchi.png"]'     WHERE id=8;
-- id 9 = Moringa (no file yet - will use fallback), id 10 = Manjistha (no file yet)
UPDATE plants SET main_image_url='/images/plants/haritaki.png',  gallery_images='["/images/plants/haritaki.png"]'    WHERE id=11;
UPDATE plants SET main_image_url='/images/plants/licorice.png',  gallery_images='["/images/plants/licorice.png"]'    WHERE id=12;
UPDATE plants SET main_image_url='/images/plants/gotukola.png',  gallery_images='["/images/plants/gotukola.png"]'    WHERE id=13;
-- ids 14-34 have no matching image files yet - leave as is (fallback handles them)
UPDATE plants SET main_image_url='/images/plants/bhringraj.png', gallery_images='["/images/plants/bhringraj.png"]'   WHERE id=35;
UPDATE plants SET main_image_url='/images/plants/peppermint.png',gallery_images='["/images/plants/peppermint.png"]'  WHERE id=36;
UPDATE plants SET main_image_url='/images/plants/cardamom.jpg',  gallery_images='["/images/plants/cardamom.jpg"]'    WHERE id=37;
UPDATE plants SET main_image_url='/images/plants/cinnamon.jpg',  gallery_images='["/images/plants/cinnamon.jpg"]'    WHERE id=38;
UPDATE plants SET main_image_url='/images/plants/clove.jpg',     gallery_images='["/images/plants/clove.jpg"]'       WHERE id=39;
UPDATE plants SET main_image_url='/images/plants/fennel.jpg',    gallery_images='["/images/plants/fennel.jpg"]'      WHERE id=40;

-- Also fix aloe vera / ginger if those plants exist
UPDATE plants SET main_image_url='/images/plants/aloe.png',      gallery_images='["/images/plants/aloe.png"]'        WHERE common_name IN ('Aloe Vera','Aloe vera');
UPDATE plants SET main_image_url='/images/plants/ginger.png',    gallery_images='["/images/plants/ginger.png"]'      WHERE common_name = 'Ginger';
UPDATE plants SET main_image_url='/images/plants/arjuna.png',    gallery_images='["/images/plants/arjuna.png"]'      WHERE common_name IN ('Arjun','Arjuna');

SELECT id, common_name, main_image_url FROM plants ORDER BY id;
