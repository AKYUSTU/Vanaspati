package com.vanaspati.repository;

import com.vanaspati.model.NewsletterSubscriber;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
    Optional<NewsletterSubscriber> findByEmail(String email);
}
