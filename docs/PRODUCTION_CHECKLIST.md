# Vanaspati Production Checklist

Use this checklist before every production release.

## 1. Environment and Secrets

- Set `SPRING_PROFILES_ACTIVE=prod` for backend runtime.
- Configure backend env vars from `vanaspati-backend/.env.example` with real credentials.
- Configure frontend env vars from `vanaspati-frontend/.env.example` with production API URL.
- Ensure `JWT_SECRET` is a strong Base64-encoded secret (at least 256-bit key material).
- Keep SMTP credentials and DB credentials out of source control.

## 2. Infrastructure Validation

- Verify MySQL and Redis are reachable from backend containers/hosts.
- Confirm Flyway migrations run cleanly in target environment.
- Ensure reverse proxy forwards `X-Forwarded-*` headers.
- Validate TLS termination and HTTPS redirects at edge/proxy.

## 3. Security Baseline

- Ensure Swagger UI is disabled in production (`springdoc.swagger-ui.enabled=false`).
- Expose only health and info actuator endpoints.
- Review CORS allowed origins for frontend production domains.
- Use least-privilege DB credentials (no root in production).
- Rotate JWT and SMTP credentials on a fixed schedule.

## 4. Observability and Operations

- Set log levels with env vars (`LOG_LEVEL_ROOT`, `LOG_LEVEL_APP`, `LOG_LEVEL_SECURITY`).
- Confirm `/actuator/health` and `/actuator/info` are available to monitoring.
- Configure alerting on API uptime, 5xx rates, DB connectivity failures, and auth errors.
- Capture and retain backend logs centrally with structured metadata.

## 5. Quality Gates Before Release

Run and pass all of the following:

```bash
# frontend
cd vanaspati-frontend
npm run lint
npm run test
npm run build

# backend
cd ../vanaspati-backend
mvn -q -DskipTests=false test
```

## 6. Post-Deployment Smoke Checks

- Open frontend and complete login, browse plants, and detail navigation.
- Verify quiz question flow and leaderboard retrieval.
- Verify herb-of-day endpoint and plant view tracking endpoint.
- Verify newsletter subscribe endpoint for new and reactivated users.
- Confirm no spike in errors in first 30 minutes after deployment.
