USE `vanaspati_db`;

INSERT INTO `plants` (
    `common_name`, `scientific_name`, `sanskrit_name`, `plant_family`, `plant_type`, 
    `native_region`, `main_image_url`, `description`, `is_active`, `is_featured`, `view_count`, `bookmark_count`
) VALUES 
(
    'Peppermint', 'Mentha piperita', 'Pudinah', 'Lamiaceae', 'HERB',
    'Europe and Middle East', '/images/plants/peppermint.png',
    'A cooling, aromatic herb famous for its digestive and respiratory benefits. It contains menthol, which naturally cools and soothes the throat and digestive tract. Often used in teas, essential oils, and balms to relieve headaches, IBS symptoms, and sinus complaints.',
    true, true, 0, 0
),
(
    'Cardamom', 'Elettaria cardamomum', 'Ela', 'Zingiberaceae', 'HERB',
    'Southern India', '/images/plants/cardamom.jpg',
    'The "Queen of Spices", prized for its intense, sweet-savory flavor and powerful digestive properties. In Ayurveda, it is used to reduce Kapha and Vata, clear respiratory congestion, and freshen the breath while stimulating digestive fire.',
    true, false, 0, 0
),
(
    'Cinnamon', 'Cinnamomum verum', 'Tvak', 'Lauraceae', 'TREE',
    'Sri Lanka, India', '/images/plants/cinnamon.jpg',
    'A warming, sweet spice derived from tree bark. It is deeply valued for its blood-sugar regulating properties, circulatory stimulation, and antimicrobial effects. Frequently used in warming herbal blends and metabolic support remedies.',
    true, false, 0, 0
),
(
    'Clove', 'Syzygium aromaticum', 'Lavanga', 'Myrtaceae', 'TREE',
    'Indonesia (Maluku Islands)', '/images/plants/clove.jpg',
    'Potent, warming flower buds rich in eugenol. Cloves are renowned for their numbing, analgesic effect on toothaches and their powerful antimicrobial and carminative actions in digestive tonics and winter defense blends.',
    true, true, 0, 0
),
(
    'Fennel', 'Foeniculum vulgare', 'Mishreya', 'Apiaceae', 'HERB',
    'Mediterranean', '/images/plants/fennel.jpg',
    'A sweet, cooling seed deeply soothing to the digestive system. Uniquely, it strengthens the digestive fire (Agni) without aggravating Pitta (heat). Often chewed post-meal to prevent gas and acidity, or brewed into tea for nursing mothers.',
    true, false, 0, 0
);
