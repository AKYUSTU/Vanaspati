SELECT r.id, r.name, r.for_ailment, r.difficulty, r.prep_time_minutes,
       LEFT(r.description,80) as desc_preview,
       GROUP_CONCAT(p.common_name SEPARATOR ', ') as linked_plants,
       CASE WHEN r.description IS NULL OR r.description='' THEN 'MISSING' ELSE 'OK' END as desc_ok,
       CASE WHEN r.for_ailment IS NULL OR r.for_ailment='' THEN 'MISSING' ELSE 'OK' END as ailment_ok,
       CASE WHEN r.difficulty IS NULL THEN 'MISSING' ELSE 'OK' END as diff_ok,
       CASE WHEN r.prep_time_minutes IS NULL THEN 'MISSING' ELSE 'OK' END as time_ok
FROM remedies r
LEFT JOIN remedy_plants rp ON r.id=rp.remedy_id
LEFT JOIN plants p ON p.id=rp.plant_id
GROUP BY r.id, r.name, r.for_ailment, r.difficulty, r.prep_time_minutes, r.description
ORDER BY r.id;
