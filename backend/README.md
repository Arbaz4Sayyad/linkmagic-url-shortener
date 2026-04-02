# URL Shortener Service

A production-ready URL shortening service built with Spring Boot.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Data JPA**
- **MySQL 8**
- **Redis**
- **Maven**
- **Lombok**
- **Testcontainers**

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis Server

### Database Setup
```sql
CREATE DATABASE url_shortener;
```

### Environment Variables
```bash
DB_USERNAME=root
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password (optional)
```

### Running the Application
```bash
# Development
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## API Endpoints

### Health Check
```
GET /api/v1/health
```

## Project Structure
```
src/main/java/com/urlshortener/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── service/         # Business logic
├── repository/      # Data access layer
├── entity/          # JPA entities
└── dto/             # Data Transfer Objects
```

## Configuration
- `application.yml` - Main configuration
- `application-dev.yml` - Development profile
- `application-prod.yml` - Production profile

## Monitoring
- Actuator endpoints: `/actuator/health`, `/actuator/metrics`
- Custom health check: `/api/v1/health`
