# 🔗 LinkMagic - Enterprise-Grade URL Shortener

[![Marketplace](https://img.shields.io/badge/Marketplace-LinkMagic-6366f1?style=for-the-badge&logo=linktree)](https://github.com/Arbaz4Sayyad/linkmagic-url-shortener)
[![Build Status](https://img.shields.io/badge/Build-Success-success?style=for-the-badge&logo=github-actions)](https://github.com/Arbaz4Sayyad/linkmagic-url-shortener)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

LinkMagic is a **production-ready, full-stack URL shortening platform** engineered for high-growth teams. Built with a high-performance **Spring Boot 3** backend and a premium **React 19** frontend, it delivers an industry-leading SaaS experience inspired by **Stripe, Vercel, and Linear**.

---

## 🏗️ System Architecture

LinkMagic leverages a multi-tier architecture designed for ultra-low latency redirection and high availability.

```mermaid
graph TD
    User([User/Client]) -->|HTTPS| Frontend[React 19 + Vite]
    Frontend -->|REST API| API[Spring Boot 3]
    API -->|Auth| Security[JWT + OAuth2]
    API -->|Cache Lookup| Redis[(Redis Caching)]
    API -->|Persistence| DB[(MySQL 8.0)]
    Redis -->|Fast Path| Redirect[Instant Redirection]
```

---

## 🚀 Key Capabilities

- ⚡ **Ultra-Fast Redirection**: Sub-millisecond resolution via Redis-backed cache.
- 📊 **Real-time Analytics**: Enterprise-grade tracking for clicks, geography, and device signatures.
- 🔐 **Hardened Security**: JWT-based session management with Google/GitHub SSO.
- 🔗 **Scalable Shortening**: Support for high-volume bulk processing and CSV ingestion.
- 📱 **Adaptive UI**: A premium "Midnight" design system with fluid glassmorphism.
- 🔑 **Developer-First**: Comprehensive API key lifecycle management for headless integrations.

---

## 🛠️ Tech Stack

### Backend Engine
- **Framework**: Spring Boot 3.2.5 (Java 17)
- **Database**: MySQL 8.0 (Relational) + Redis (Edge Caching)
- **Security**: Spring Security + JWT + OAuth2 (SSO)
- **Migration**: Flyway-managed schema evolution

### Frontend Experience
- **Framework**: React 19 + Vite (Modern ESM)
- **Styling**: Tailwind CSS + Framer Motion (Fluid Animations)
- **Visualization**: Recharts (Dynamic Analytics Dashboards)
- **Icons**: Custom Bulletproof SVG system (Lucide-React based)

---

## 📖 API Documentation

### Shorten a URL
`POST /api/v1/shorten`

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very-long-path",
    "customAlias": "custom-link"
  }'
```

**Response:**
```json
{
  "shortUrl": "http://lnk.mg/custom-link",
  "originalUrl": "https://example.com/very-long-path",
  "createdAt": "2024-04-02T12:00:00Z"
}
```

---

## ⚙️ Development Setup

### Infrastructure (Docker)
Ensure Docker is running and execute:
```bash
docker-compose up -d
```

### Manual Service Start
| Service | Directory | Command |
| :--- | :--- | :--- |
| **Backend** | `./backend` | `mvn spring-boot:run` |
| **Frontend** | `./frontend` | `npm install && npm run dev` |

---

## 🧪 Testing Strategy
We maintain a high quality bar through comprehensive test coverage:
* **Backend**: Junit 5 + Mockito (Service layer), Testcontainers (Integration).
* **Frontend**: Vitest + React Testing Library (Component & Logic).

```bash
# Run all tests
cd backend && mvn test
cd frontend && npm test
```

---

## 🛡️ Security Implementation
- **Rate Limiting**: Redis-based throttling to prevent brute-force attacks.
- **Input Sanitization**: Extreme validation on original URLs to prevent XSS/SSRF.
- **Stateless Auth**: JWT signatures with secure cookie storage.

---

## 🤝 Contributing
Engineered for extensibility. See [CONTRIBUTING.md](CONTRIBUTING.md) for architectural guidelines and PR standards.

---

## 📜 License
Distributed under the **MIT License**. Created by [Arbaz Sayyad](https://github.com/Arbaz4Sayyad).
