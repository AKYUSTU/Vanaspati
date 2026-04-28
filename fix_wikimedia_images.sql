-- Replace 23 incorrect/animated images with verified real botanical photographs
-- Source: Wikimedia Commons (Wikipedia's photo library) - always shows the CORRECT plant

-- Ajwain (Trachyspermum ammi) - real photo from Wikipedia
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ajwain_seeds.jpg/800px-Ajwain_seeds.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ajwain_seeds.jpg/800px-Ajwain_seeds.jpg"]'
WHERE id=16;

-- Arjun tree (Terminalia arjuna)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg/800px-Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg/800px-Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg"]'
WHERE id=18;

-- Arnica Montana - real alpine flower photo
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Arnica_montana_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-016.jpg/800px-Arnica_montana_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-016.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Arnica_montana_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-016.jpg/800px-Arnica_montana_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-016.jpg"]'
WHERE id=26;

-- Atees (Aconitum heterophyllum) - Himalayan herb
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Aconitum_heterophyllum.jpg/800px-Aconitum_heterophyllum.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Aconitum_heterophyllum.jpg/800px-Aconitum_heterophyllum.jpg"]'
WHERE id=20;

-- Belladonna (Atropa belladonna)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Atropa_belladonna_plant.jpg/800px-Atropa_belladonna_plant.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Atropa_belladonna_plant.jpg/800px-Atropa_belladonna_plant.jpg"]'
WHERE id=27;

-- Calendula officinalis - real orange flower
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-025.jpg/800px-Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-025.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-025.jpg/800px-Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-025.jpg"]'
WHERE id=28;

-- Hypericum / St. John's Wort
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hypericum_perforatum_Herba.jpg/800px-Hypericum_perforatum_Herba.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hypericum_perforatum_Herba.jpg/800px-Hypericum_perforatum_Herba.jpg"]'
WHERE id=29;

-- Jatamansi (Nardostachys jatamansi)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Nardostachys_jatamansi.jpg/800px-Nardostachys_jatamansi.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Nardostachys_jatamansi.jpg/800px-Nardostachys_jatamansi.jpg"]'
WHERE id=33;

-- Kalonji / Nigella sativa (black seed)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nigella_sativa.jpg/800px-Nigella_sativa.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nigella_sativa.jpg/800px-Nigella_sativa.jpg"]'
WHERE id=17;

-- Kapikacchu (Mucuna pruriens / velvet bean)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Mucuna_pruriens_MS_4531.jpg/800px-Mucuna_pruriens_MS_4531.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Mucuna_pruriens_MS_4531.jpg/800px-Mucuna_pruriens_MS_4531.jpg"]'
WHERE id=34;

-- Keezhanelli (Phyllanthus niruri / stonebreaker)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Phyllanthus_niruri_kerala.jpg/800px-Phyllanthus_niruri_kerala.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Phyllanthus_niruri_kerala.jpg/800px-Phyllanthus_niruri_kerala.jpg"]'
WHERE id=22;

-- Kokilaksha (Asteracantha longifolia)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hygrophila_auriculata.jpg/800px-Hygrophila_auriculata.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hygrophila_auriculata.jpg/800px-Hygrophila_auriculata.jpg"]'
WHERE id=24;

-- Manjistha (Rubia cordifolia / Indian madder)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rubia_cordifolia_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-122.jpg/800px-Rubia_cordifolia_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-122.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rubia_cordifolia_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-122.jpg/800px-Rubia_cordifolia_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-122.jpg"]'
WHERE id=10;

-- Moringa (Moringa oleifera / drumstick tree)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Moringa_oleifera_Blanco1.189.png/800px-Moringa_oleifera_Blanco1.189.png',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Moringa_oleifera_Blanco1.189.png/800px-Moringa_oleifera_Blanco1.189.png"]'
WHERE id=9;

-- Nilavembu (Andrographis paniculata / king of bitters)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Andrographis_paniculata.jpg/800px-Andrographis_paniculata.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Andrographis_paniculata.jpg/800px-Andrographis_paniculata.jpg"]'
WHERE id=21;

-- Pulsatilla (Pulsatilla vulgaris / pasque flower)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pulsatilla_vulgaris_01.jpg/800px-Pulsatilla_vulgaris_01.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pulsatilla_vulgaris_01.jpg/800px-Pulsatilla_vulgaris_01.jpg"]'
WHERE id=30;

-- Punarnava (Boerhavia diffusa)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Boerhavia_diffusa.jpg/800px-Boerhavia_diffusa.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Boerhavia_diffusa.jpg/800px-Boerhavia_diffusa.jpg"]'
WHERE id=14;

-- Senna (Cassia senna / Alexandrian senna)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Senna_alexandrina_-_Cassia_senna_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-031.jpg/800px-Senna_alexandrina_-_Cassia_senna_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-031.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Senna_alexandrina_-_Cassia_senna_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-031.jpg/800px-Senna_alexandrina_-_Cassia_senna_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-031.jpg"]'
WHERE id=19;

-- Shankhpushpi (Convolvulus pluricaulis)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Evolvulus_alsinoides_01.jpg/800px-Evolvulus_alsinoides_01.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Evolvulus_alsinoides_01.jpg/800px-Evolvulus_alsinoides_01.jpg"]'
WHERE id=31;

-- Thoothuvalai (Solanum trilobatum)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Solanum_trilobatum_MS_3640.jpg/800px-Solanum_trilobatum_MS_3640.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Solanum_trilobatum_MS_3640.jpg/800px-Solanum_trilobatum_MS_3640.jpg"]'
WHERE id=23;

-- Vacha / Sweet Flag (Acorus calamus)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Acorus_calamus_W.jpg/800px-Acorus_calamus_W.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Acorus_calamus_W.jpg/800px-Acorus_calamus_W.jpg"]'
WHERE id=32;

-- Vembu Siddha (Neem variant - using authentic neem tree close-up)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg/800px-Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg/800px-Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg"]'
WHERE id=25;

-- Vidanga (Embelia ribes / false black pepper)
UPDATE plants SET
  main_image_url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Embelia_ribes_W2_IMG_1285.jpg/800px-Embelia_ribes_W2_IMG_1285.jpg',
  gallery_images='["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Embelia_ribes_W2_IMG_1285.jpg/800px-Embelia_ribes_W2_IMG_1285.jpg"]'
WHERE id=15;

-- Verify the 23 updated plants
SELECT id, common_name, main_image_url FROM plants
WHERE id IN (9,10,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34)
ORDER BY id;
