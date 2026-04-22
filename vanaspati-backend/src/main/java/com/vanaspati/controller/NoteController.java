package com.vanaspati.controller;

import com.vanaspati.model.UserNote;
import com.vanaspati.repository.UserNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final UserNoteRepository userNoteRepository;

    @GetMapping("/{plantId}")
    public ResponseEntity<UserNote> getNoteByPlant(@PathVariable Long plantId) {
        return userNoteRepository.findAll().stream().findFirst().map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{plantId}")
    public ResponseEntity<UserNote> upsertNote(@PathVariable Long plantId, @RequestBody UserNote note) {
        return ResponseEntity.ok(userNoteRepository.save(note));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId) {
        userNoteRepository.deleteById(noteId);
        return ResponseEntity.ok().build();
    }
}
