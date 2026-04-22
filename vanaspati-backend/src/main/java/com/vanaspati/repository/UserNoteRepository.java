package com.vanaspati.repository;

import com.vanaspati.model.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNoteRepository extends JpaRepository<UserNote, Long> {
}
