package com.vanaspati.repository;

import com.vanaspati.model.Plant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PlantRepository extends JpaRepository<Plant, Long> {

	boolean existsByScientificNameIgnoreCase(String scientificName);

	java.util.Optional<Plant> findByScientificNameIgnoreCase(String scientificName);

	@Query(
		value = """
			SELECT p.*
			FROM plants p
			WHERE p.is_active = true
			  AND (:q IS NULL OR :q = '' OR LOWER(p.common_name) LIKE CONCAT('%', LOWER(:q), '%')
				   OR LOWER(p.scientific_name) LIKE CONCAT('%', LOWER(:q), '%')
				   OR LOWER(COALESCE(p.sanskrit_name, '')) LIKE CONCAT('%', LOWER(:q), '%'))
			  AND (:type IS NULL OR :type = '' OR p.plant_type = :type)
			  AND (:region IS NULL OR :region = '' OR LOWER(COALESCE(p.native_region, '')) LIKE CONCAT('%', LOWER(:region), '%'))
			  AND (
					:system IS NULL OR :system = '' OR EXISTS (
						SELECT 1
						FROM plant_ayush_systems pas
						JOIN ayush_systems s ON s.id = pas.system_id
						WHERE pas.plant_id = p.id AND s.name = :system
					)
				  )
			  AND (
					:ailment IS NULL OR :ailment = '' OR EXISTS (
						SELECT 1
						FROM plant_ailments pa
						JOIN ailment_categories ac ON ac.id = pa.ailment_id
						WHERE pa.plant_id = p.id
						  AND (LOWER(ac.slug) = LOWER(:ailment) OR LOWER(ac.name) = LOWER(:ailment))
					)
				  )
			""",
		countQuery = """
			SELECT COUNT(*)
			FROM plants p
			WHERE p.is_active = true
			  AND (:q IS NULL OR :q = '' OR LOWER(p.common_name) LIKE CONCAT('%', LOWER(:q), '%')
				   OR LOWER(p.scientific_name) LIKE CONCAT('%', LOWER(:q), '%')
				   OR LOWER(COALESCE(p.sanskrit_name, '')) LIKE CONCAT('%', LOWER(:q), '%'))
			  AND (:type IS NULL OR :type = '' OR p.plant_type = :type)
			  AND (:region IS NULL OR :region = '' OR LOWER(COALESCE(p.native_region, '')) LIKE CONCAT('%', LOWER(:region), '%'))
			  AND (
					:system IS NULL OR :system = '' OR EXISTS (
						SELECT 1
						FROM plant_ayush_systems pas
						JOIN ayush_systems s ON s.id = pas.system_id
						WHERE pas.plant_id = p.id AND s.name = :system
					)
				  )
			  AND (
					:ailment IS NULL OR :ailment = '' OR EXISTS (
						SELECT 1
						FROM plant_ailments pa
						JOIN ailment_categories ac ON ac.id = pa.ailment_id
						WHERE pa.plant_id = p.id
						  AND (LOWER(ac.slug) = LOWER(:ailment) OR LOWER(ac.name) = LOWER(:ailment))
					)
				  )
			""",
		nativeQuery = true
	)
	Page<Plant> findFiltered(
		@Param("q") String q,
		@Param("system") String system,
		@Param("ailment") String ailment,
		@Param("type") String type,
		@Param("region") String region,
		Pageable pageable
	);

	@Query(
		value = """
			SELECT p.*
			FROM plants p
			WHERE p.is_active = true
			  AND (
				  LOWER(p.common_name) LIKE CONCAT('%', LOWER(:q), '%')
				  OR LOWER(p.scientific_name) LIKE CONCAT('%', LOWER(:q), '%')
				  OR LOWER(COALESCE(p.sanskrit_name, '')) LIKE CONCAT('%', LOWER(:q), '%')
			  )
			ORDER BY p.common_name ASC
			LIMIT 8
			""",
		nativeQuery = true
	)
	List<Plant> searchAutocomplete(@Param("q") String q);

	@Query(value = "SELECT p.* FROM plants p WHERE p.is_active = true", nativeQuery = true)
	Page<Plant> findAllActive(Pageable pageable);
}
