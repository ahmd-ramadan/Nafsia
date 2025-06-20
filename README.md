# Nafsia Backend

**Nafsia** is a scalable, secure, and feature-rich backend system for a mental health and counseling platform. Built with Node.js, TypeScript, and MongoDB, it provides robust APIs for user management, appointments, posts, messaging, and more. This project is the backend for a graduation project, designed with best practices in mind.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Security](#security)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication & Authorization** (JWT, roles)
- **User Profiles** (patients, doctors)
- **Appointments & Sessions** (booking, management, status tracking)
- **Posts & Tags** (create, interact, save, react)
- **Reviews & Ratings** (service feedback)
- **Messaging System** (direct chat)
- **Measurement Tracking** (mental health metrics)
- **Comprehensive Validation** (Zod)
- **Rate Limiting & Security Middlewares**
- **Swagger API Documentation**
- **Email & OTP Verification**
- **Cloudinary Integration for Media**
- **Redis Caching Support**
- **Advanced Logging (Winston, Morgan)**
- **XSS & Input Sanitization**

---

## Tech Stack

- **Node.js** & **TypeScript**
- **Express.js** (v5)
- **MongoDB** (Mongoose ODM)
- **Redis** (optional, for caching)
- **Swagger** (OpenAPI 3.0)
- **Cloudinary** (media storage)
- **Nodemailer** (email)
- **Helmet, CORS, Compression** (security & performance)
- **Jest** (recommended for testing)

---

## Project Structure

```
src/
  access/           # Access control logic
  config/           # Environment & app configuration
  controllers/      # Route controllers
  enums/            # Enums and constants
  interfaces/       # TypeScript interfaces
  middlewares/      # Express middlewares (security, validation, etc.)
  models/           # Mongoose models (User, Post, Appointment, etc.)
  repositories/     # Data access logic
  routes/           # Express route definitions
  services/         # Business logic (auth, email, etc.)
  swagger/          # Swagger docs and setup
  templates/        # Email templates
  types/            # Custom types
  utils/            # Utility functions (logger, error handling, etc.)
  validation/       # Zod validation schemas
  app.ts            # Express app setup
  index.ts          # App entry point
```

---

## API Documentation

- **Interactive API Docs:**  
  After running the server, visit:  
  `http://localhost:<PORT>/api-docs`  
  (Swagger UI powered by `src/swagger/swagger.yml`)

- **API Versioning:**  
  All endpoints are prefixed with `/api/v1/`

- **Main Endpoints:**
  - `/auth` - Authentication (register, login, OTP, etc.)
  - `/user` - User management
  - `/appointment` - Appointments
  - `/session` - Sessions
  - `/post` - Posts
  - `/tag` - Tags
  - `/review` - Reviews
  - `/react` - Post reactions
  - `/saved-posts` - Saved posts
  - `/message` - Messaging
  - `/measurement` - Mental health measurements

---

## Database Models

- **User:** Patients, doctors, roles, profile info, auth
- **Appointment:** Booking, status, doctor, patient, time
- **Session:** Session details, notes, feedback
- **Post:** Content, tags, author, reactions
- **Tag:** Post categorization
- **Review:** Ratings, comments, user, target
- **Message:** Direct chat between users
- **Measurement:** Mental health metrics tracking
- **SavedPosts, React, Token, Otp, Doctor** (see `src/models/`)

---

## Security

- **Helmet** for HTTP headers
- **CORS** with strict config
- **XSS Protection** via DOMPurify & custom middleware
- **Rate Limiting** to prevent abuse
- **Input Validation** with Zod
- **Password Hashing** with bcryptjs
- **JWT Authentication**
- **Error Handling** with centralized logger

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd nafsia
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env.local` file (see [Environment Variables](#environment-variables)).

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   For development with hot-reload:
   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env.local` file in the root directory. Example:

```
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nafsia

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=yourpassword

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Client
CLIENT_URL=http://localhost:3000
```

---

## Scripts

- `npm run build` — Compile TypeScript and copy assets
- `npm start` — Run the compiled app (production)
- `npm run dev` — Start in development mode with hot-reload
- `npm run copy-swagger` — Copy Swagger docs to dist
- `npm run copy-templates` — Copy email templates to dist

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

This project is licensed under the MIT License.

---

**Developed by Ahmed Ramadan as a graduation project.** 