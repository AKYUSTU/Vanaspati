package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.model.NewsletterSubscriber;
import com.vanaspati.repository.NewsletterSubscriberRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NewsletterServiceTest {

    @Mock
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    @InjectMocks
    private NewsletterService newsletterService;

    @Test
    void subscribe_whenAlreadyActive_throwsDuplicate() {
        NewsletterSubscriber active = NewsletterSubscriber.builder().id(1L).email("user@example.com").isActive(true).build();
        when(newsletterSubscriberRepository.findByEmail("user@example.com")).thenReturn(Optional.of(active));

        assertThrows(DuplicateResourceException.class, () -> newsletterService.subscribe("user@example.com"));
        verify(newsletterSubscriberRepository, never()).save(any(NewsletterSubscriber.class));
    }

    @Test
    void subscribe_whenInactive_reactivatesExistingSubscriber() {
        NewsletterSubscriber inactive = NewsletterSubscriber.builder().id(2L).email("user@example.com").isActive(false).build();
        when(newsletterSubscriberRepository.findByEmail("user@example.com")).thenReturn(Optional.of(inactive));

        newsletterService.subscribe("user@example.com");

        ArgumentCaptor<NewsletterSubscriber> captor = ArgumentCaptor.forClass(NewsletterSubscriber.class);
        verify(newsletterSubscriberRepository).save(captor.capture());
        assertEquals(true, captor.getValue().getIsActive());
    }

    @Test
    void subscribe_whenNewEmail_createsActiveSubscriber() {
        when(newsletterSubscriberRepository.findByEmail("fresh@example.com")).thenReturn(Optional.empty());

        newsletterService.subscribe("fresh@example.com");

        ArgumentCaptor<NewsletterSubscriber> captor = ArgumentCaptor.forClass(NewsletterSubscriber.class);
        verify(newsletterSubscriberRepository).save(captor.capture());
        assertEquals("fresh@example.com", captor.getValue().getEmail());
        assertEquals(true, captor.getValue().getIsActive());
    }
}
