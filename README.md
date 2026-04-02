# URL Shortener Application

A full-stack URL shortening service with Spring Boot backend.

## Project Structure

```
url-shortener/
├── backend/          # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── frontend/         # (to be added)
```

## Quick Start

### Backend Setup
See `backend/README.md` for detailed backend setup instructions.

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis Server

## Running the Application

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (coming soon)
cd frontend
npm start
```

## API Documentation

Backend API will be available at: `http://localhost:8080/api/v1`

Health Check: `http://localhost:8080/api/v1/health`
