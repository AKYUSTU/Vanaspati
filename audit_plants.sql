SELECT id, common_name, scientific_name, plant_type, native_region,
       LEFT(description,80) as desc_preview,
       parts_used, rasa, body_parts,
       CASE WHEN main_image_url IS NULL OR main_image_url='' THEN 'NO IMAGE' ELSE 'OK' END as image_ok,
       CASE WHEN description IS NULL OR description='' THEN 'MISSING' ELSE 'OK' END as desc_ok,
       CASE WHEN scientific_name IS NULL OR scientific_name='' THEN 'MISSING' ELSE 'OK' END as sci_ok,
       CASE WHEN parts_used IS NULL OR parts_used='' THEN 'MISSING' ELSE 'OK' END as parts_ok,
       CASE WHEN body_parts IS NULL OR body_parts='' THEN 'MISSING' ELSE 'OK' END as bodyparts_ok
FROM plants WHERE is_active=1 ORDER BY id;
