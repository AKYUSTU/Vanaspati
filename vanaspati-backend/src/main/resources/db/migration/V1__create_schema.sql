CREATE TABLE plants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  common_name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150) NOT NULL UNIQUE,
  sanskrit_name VARCHAR(100),
  local_names JSON,
  plant_family VARCHAR(100),
  plant_type ENUM('TREE','SHRUB','HERB','CLIMBER','GRASS'),
  native_region VARCHAR(200),
  native_lat DECIMAL(9,6),
  native_lng DECIMAL(9,6),
  description TEXT,
  morphology TEXT,
  identifying_features TEXT,
  main_image_url VARCHAR(500),
  gallery_images JSON,
  parts_used VARCHAR(200),
  rasa VARCHAR(100),
  virya VARCHAR(50),
  vipaka VARCHAR(50),
  body_parts JSON,
  harvest_months JSON,
  bloom_months JSON,
  active_compounds TEXT,
  precautions TEXT,
  contraindications TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  bookmark_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plant_type (plant_type),
  INDEX idx_featured (is_featured),
  FULLTEXT INDEX ft_plant_search (common_name, scientific_name, sanskrit_name, description)
);

CREATE TABLE ayush_systems (
  id BIGINT PRIMARY KEY,
  name ENUM('AYURVEDA','YOGA','UNANI','SIDDHA','HOMEOPATHY') UNIQUE,
  description TEXT,
  origin_text TEXT,
  color_hex VARCHAR(10),
  icon_emoji VARCHAR(10),
  plant_count INT DEFAULT 0
);

CREATE TABLE plant_ayush_systems (
  plant_id BIGINT NOT NULL,
  system_id BIGINT NOT NULL,
  system_specific_name VARCHAR(150),
  system_specific_uses TEXT,
  classical_text_ref VARCHAR(300),
  mizaj VARCHAR(100),
  siddha_name VARCHAR(100),
  tincture_details VARCHAR(300),
  PRIMARY KEY (plant_id, system_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (system_id) REFERENCES ayush_systems(id)
);

CREATE TABLE ailment_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  icon_emoji VARCHAR(10),
  body_part VARCHAR(50),
  description VARCHAR(500)
);

CREATE TABLE plant_ailments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL,
  ailment_id BIGINT NOT NULL,
  how_used TEXT,
  dosage_form VARCHAR(200),
  notes TEXT,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (ailment_id) REFERENCES ailment_categories(id)
);

CREATE TABLE cultivation_info (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL UNIQUE,
  soil_type VARCHAR(200),
  ph_min DECIMAL(4,2),
  ph_max DECIMAL(4,2),
  sunlight ENUM('FULL_SUN','PARTIAL_SHADE','FULL_SHADE'),
  water_needs ENUM('LOW','MODERATE','HIGH'),
  best_season VARCHAR(100),
  propagation_method VARCHAR(200),
  growth_duration VARCHAR(100),
  companion_plants VARCHAR(300),
  grow_at_home_tips TEXT,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE phytochemistry (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL,
  compound_name VARCHAR(150),
  compound_type VARCHAR(100),
  key_action VARCHAR(300),
  simple_explanation TEXT,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE research_studies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL,
  title VARCHAR(500),
  authors VARCHAR(300),
  journal VARCHAR(200),
  year INT,
  url VARCHAR(500),
  abstract_summary TEXT,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE remedies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  for_ailment VARCHAR(200),
  ailment_id BIGINT,
  difficulty ENUM('BEGINNER','INTERMEDIATE','ADVANCED'),
  prep_time_minutes INT,
  description TEXT,
  precautions TEXT,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ailment_id) REFERENCES ailment_categories(id)
);

CREATE TABLE remedy_plants (
  remedy_id BIGINT,
  plant_id BIGINT,
  PRIMARY KEY (remedy_id, plant_id),
  FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

CREATE TABLE remedy_ingredients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  remedy_id BIGINT NOT NULL,
  plant_id BIGINT,
  ingredient_name VARCHAR(150) NOT NULL,
  quantity VARCHAR(100),
  notes VARCHAR(300),
  FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

CREATE TABLE remedy_steps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  remedy_id BIGINT NOT NULL,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE
);

CREATE TABLE remedy_ratings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  remedy_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_remedy_rating_user (remedy_id, user_id),
  FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE
);

CREATE TABLE garden_zones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  zone_name VARCHAR(100) NOT NULL,
  zone_key VARCHAR(50) UNIQUE,
  description TEXT,
  ayush_system_id BIGINT,
  svg_path_data TEXT,
  svg_cx INT,
  svg_cy INT,
  color_hex VARCHAR(10),
  icon_emoji VARCHAR(10),
  FOREIGN KEY (ayush_system_id) REFERENCES ayush_systems(id)
);

CREATE TABLE plant_garden_zones (
  plant_id BIGINT,
  zone_id BIGINT,
  PRIMARY KEY (plant_id, zone_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES garden_zones(id)
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  dosha_result VARCHAR(50),
  dosha_percentages JSON,
  points INT DEFAULT 0,
  level ENUM('SEED','SPROUT','SAPLING','HERBALIST','VAIDYA') DEFAULT 'SEED',
  language_pref VARCHAR(10) DEFAULT 'en',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  password_reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP NULL,
  UNIQUE INDEX idx_email (email)
);

CREATE TABLE bookmarks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  plant_id BIGINT NOT NULL,
  personal_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_plant_bookmark (user_id, plant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE user_notes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  plant_id BIGINT NOT NULL,
  note_text TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_plant_note (user_id, plant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE plant_view_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  plant_id BIGINT NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  INDEX idx_user_history (user_id, viewed_at)
);

CREATE TABLE user_points_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  action VARCHAR(100),
  points INT,
  reference_id BIGINT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_achievements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  achievement_key VARCHAR(50),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_achievement (user_id, achievement_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE quiz_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_text TEXT NOT NULL,
  option_a TEXT,
  dosha_a VARCHAR(10),
  option_b TEXT,
  dosha_b VARCHAR(10),
  option_c TEXT,
  dosha_c VARCHAR(10),
  display_order INT
);

CREATE TABLE plant_quiz_scores (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  nickname VARCHAR(50),
  score INT,
  total INT,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE newsletter_subscribers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(150) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
