package com.vanaspati.service;

import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.model.NewsletterSubscriber;
import com.vanaspati.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

    @Transactional
    public void subscribe(String email) {
        newsletterSubscriberRepository.findByEmail(email).ifPresent(existing -> {
            if (Boolean.TRUE.equals(existing.getIsActive())) {
                throw new DuplicateResourceException("Email already subscribed");
            }
            existing.setIsActive(true);
            newsletterSubscriberRepository.save(existing);
        });

        if (newsletterSubscriberRepository.findByEmail(email).isEmpty()) {
            NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .isActive(true)
                .build();
            newsletterSubscriberRepository.save(subscriber);
        }
    }
}
