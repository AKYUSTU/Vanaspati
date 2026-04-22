# Vanaspati

![Vanaspati banner](assets/banner.svg)

India's Digital Sanctuary of Healing Plants.

[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- [x] Spring Boot 3.2 backend with REST API only
- [x] JWT auth, password reset, and role-based security
- [x] Flyway schema and seed migrations
- [x] MySQL + Redis local development via Docker Compose
- [x] React 18 + Vite frontend with route-level code splitting
- [x] TanStack Query and Zustand state management
- [x] AYUSH-focused design system with custom CSS variables
- [x] Animated homepage hero, body map, and herb-of-the-day card
- [x] Plant discovery, detail, garden, dashboard, quiz, compare, remedies, calendar, ailments, learn, auth, and admin pages
- [x] Floating AI chat widget
- [x] Print-friendly styles and custom 404/500 screens
- [x] OpenAPI / Swagger UI at `/swagger-ui.html`
- [x] Postman collection for plant endpoints

## Prerequisites

- Java 17
- Node 20+
- Maven 3.9+
- MySQL 8
- Redis 7

## Quick Start

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Start backend

```bash
cd vanaspati-backend
mvn spring-boot:run
```

### 3. Start frontend

```bash
cd vanaspati-frontend
npm install
npm run dev
```

## Manual Setup

### Backend

1. Configure environment variables from [vanaspati-backend/.env.example](vanaspati-backend/.env.example).
2. Ensure MySQL and Redis are running.
3. Run Flyway migrations on startup.
4. Open Swagger UI at `/swagger-ui.html`.

### Frontend

1. Configure [vanaspati-frontend/.env.example](vanaspati-frontend/.env.example).
2. Run `npm install`.
3. Run `npm run dev`.
4. Build with `npm run build`.

## Production Deployment Baseline

1. Set backend profile to `prod` via `SPRING_PROFILES_ACTIVE=prod`.
2. Set `VITE_API_BASE_URL` to your HTTPS API endpoint.
3. Keep Swagger disabled in production (`SWAGGER_UI_ENABLED=false`).
4. Expose only `health,info` actuator endpoints.
5. Run full quality gates before every release:

```bash
cd vanaspati-frontend
npm run lint && npm run test && npm run build

cd ../vanaspati-backend
mvn -q -DskipTests=false test
```

See the full release checklist in [docs/PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md).

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `MYSQL_URL` | Backend datasource URL |
| `MYSQL_USERNAME` | MySQL username |
| `MYSQL_PASSWORD` | MySQL password |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `JWT_SECRET` | Base64 JWT signing secret |
| `JWT_EXPIRATION_MS` | Access token TTL |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh token TTL |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `VITE_API_BASE_URL` | Frontend API base URL |

## API Endpoint Table

| Area | Method | Endpoint |
| --- | --- | --- |
| Auth | POST | `/api/auth/register` |
| Auth | POST | `/api/auth/login` |
| Auth | POST | `/api/auth/logout` |
| Auth | POST | `/api/auth/forgot-password` |
| Auth | POST | `/api/auth/reset-password` |
| Auth | POST | `/api/auth/refresh` |
| Plants | GET | `/api/plants` |
| Plants | GET | `/api/plants/{id}` |
| Plants | GET | `/api/plants/{id}/summary` |
| Plants | GET | `/api/plants/search?q=` |
| Plants | GET | `/api/plants/filter` |
| Plants | GET | `/api/plants/herb-of-day` |
| Plants | GET | `/api/plants/compare?ids=1,2,3` |
| Plants | GET | `/api/plants/by-body-part?part=JOINTS` |
| Plants | GET | `/api/plants/seasonal-data` |
| Plants | POST | `/api/plants/{id}/view` |
| Bookmarks | GET | `/api/bookmarks` |
| Bookmarks | GET | `/api/bookmarks/export` |
| Bookmarks | POST | `/api/bookmarks/{plantId}` |
| Bookmarks | DELETE | `/api/bookmarks/{plantId}` |
| Users | GET | `/api/users/me` |
| Users | PUT | `/api/users/me` |
| Users | PUT | `/api/users/me/password` |
| Users | DELETE | `/api/users/me` |
| Users | GET | `/api/users/me/history` |
| Users | DELETE | `/api/users/me/history` |
| Users | GET | `/api/users/me/points-history` |
| Quiz | GET | `/api/quiz/dosha/questions` |
| Quiz | POST | `/api/quiz/dosha/result` |
| Quiz | GET | `/api/quiz/plant/question` |
| Quiz | POST | `/api/quiz/plant/score` |
| Quiz | GET | `/api/quiz/plant/leaderboard` |
| Notes | GET | `/api/notes/{plantId}` |
| Notes | POST | `/api/notes/{plantId}` |
| Notes | DELETE | `/api/notes/{noteId}` |
| Remedies | GET | `/api/remedies` |
| Remedies | GET | `/api/remedies/{id}` |
| Remedies | GET | `/api/remedies/by-plant/{id}` |
| Remedies | GET | `/api/remedies/by-ailment/{id}` |
| Remedies | POST | `/api/remedies/{id}/rate` |
| Garden | GET | `/api/garden/zones` |
| Garden | GET | `/api/garden/zones/{id}/plants` |
| Ailments | GET | `/api/ailments` |
| Ailments | GET | `/api/ailments/{id}` |
| Ailments | GET | `/api/ailments/{id}/remedies` |
| Seasonal Calendar | GET | `/api/plants/seasonal-data` |
| Admin | GET | `/api/admin/stats` |
| Admin | GET | `/api/admin/users` |
| Admin | PUT | `/api/admin/users/{id}/role` |
| Admin | POST | `/api/admin/plants/bulk-import` |
| AI | POST | `/api/ai/chat` |
| Misc | POST | `/api/newsletter/subscribe` |
| Misc | GET | `/api/health` |

## Database Schema Overview

- `plants`
- `ayush_systems`
- `plant_ayush_systems`
- `ailment_categories`
- `plant_ailments`
- `cultivation_info`
- `phytochemistry`
- `research_studies`
- `remedies`
- `remedy_plants`
- `remedy_ingredients`
- `remedy_steps`
- `remedy_ratings`
- `garden_zones`
- `plant_garden_zones`
- `users`
- `bookmarks`
- `user_notes`
- `plant_view_history`
- `user_points_history`
- `user_achievements`
- `quiz_questions`
- `plant_quiz_scores`
- `newsletter_subscribers`

## Folder Structure

```text
vanaspati-backend/
  pom.xml
  src/main/java/com/vanaspati/
    config/
    controller/
    dto/
    exception/
    mapper/
    model/
    repository/
    service/
  src/main/resources/
    application.properties
    db/migration/

vanaspati-frontend/
  package.json
  index.html
  src/
    api/
    components/
    hooks/
    pages/
    store/
    styles/
```

## Screenshots

Describe these six key screens in your own capture set:

1. Home page hero with leaf particles and search autocomplete
2. Plant discovery grid with filters and quick view modal
3. Plant profile page with sticky TOC and detail sections
4. Virtual garden map with interactive zones
5. Dashboard with progress ring and bookmarks
6. Quiz result view with radar chart and personalized recommendations

## Contribution Guide

1. Create a feature branch.
2. Keep changes scoped to one phase or one feature slice.
3. Run backend compile and frontend build before opening a PR.
4. Include API or UI screenshots when relevant.
5. Do not introduce new dependencies unless they clearly reduce complexity or risk.

## License

MIT.

## Medical Disclaimer

Vanaspati is an educational project and is not a substitute for medical advice, diagnosis, or treatment. Always consult a qualified practitioner before using medicinal plants or remedies.
