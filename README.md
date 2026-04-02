# 🔗 LinkMagic - Premium URL Shortener

LinkMagic is a **production-ready, full-stack URL shortening platform** built with a high-performance Spring Boot backend and a premium React frontend.

It is designed to deliver a **modern SaaS experience** inspired by industry-leading platforms like Stripe, Vercel, and Linear — focusing on **speed, security, and stunning UI/UX**.

---

## 🚀 Live Features

- ⚡ Instant URL shortening with ultra-fast redirection
- 📊 Real-time analytics (clicks, geography, devices)
- 🔐 Secure authentication (JWT + OAuth2)
- 🔗 Bulk URL shortening (CSV upload supported)
- 📱 Fully responsive premium UI
- 🧠 API key generation for developers

---

## 🏗️ Architecture & Tech Stack

### 🔙 Backend (Spring Boot)

- Java 17 + Spring Boot 3.x
- MySQL 8.0 (Primary Database)
- Redis (Caching + Rate Limiting)
- Spring Security + JWT Authentication
- OAuth2 Login (Google + GitHub)
- Flyway (Database Migrations)
- Dockerized Setup

---

### 🎨 Frontend (React + Vite)

- React 19 + Vite
- Tailwind CSS (Modern UI)
- Framer Motion (Animations)
- Glassmorphism UI + Dark Theme
- Recharts (Analytics Dashboard)
- Lucide Icons

---

## ✨ Key Features

| Feature | Description |
|--------|------------|
| ⚡ Instant Redirection | Redis-powered high-speed link resolution |
| 📦 Bulk Shortening | Upload CSV or shorten multiple URLs |
| 📊 Deep Analytics | Track clicks, devices, location |
| 🔑 API Access | Generate API keys for integrations |
| 🎯 Premium UX | Clean SaaS-style onboarding |
| 📱 Mobile Ready | Fully responsive design |

---

## 📂 Project Structure
```text
url-shortener/
├── backend/
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
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Configuration

### Backend (`application.yml` or `.env`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener
spring.redis.host=localhost
jwt.secret=your_secret
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🎯 How It Works
1. Paste your long URL
2. Click on "Shorten"
3. Get a short URL instantly
4. Track analytics in dashboard

---

## 🎨 UI Highlight
The project features a **"Midnight Dark Mode UI"**, built with:
- Glassmorphism effects
- Neon gradients
- Smooth animations
- Premium SaaS feel

---

## 📈 Future Enhancements
- Custom domains
- AI-based link insights

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork and improve.

---

## 📜 License
MIT License

---

## 💡 Author
Developed by **Arbaz Sayyad**
