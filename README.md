# Accord Innovations - Places Explorer

This application allows users to search for places using the Google Places API and mark them as favorites. It features a React frontend and a Spring Boot backend that persists data to a database.

---

## ✨ Features

- **Place Search**: Autocompletes place searches using the Google Places API.
- **Map View**: Displays the selected place on an interactive map.
- **One-Click Favoriting**: Easily add or remove a place from your favorites.
- **Real-Time Updates**: The UI instantly shows if a place is a favorite.
- **Favorites List**: See all your saved places in one list.
- **Persistent Storage**: Your favorites are saved in a database (MySQL or MSSQL), so they're there when you come back.
- **Responsive UI**: Looks great on both desktop and mobile.

---

## 🚀 Quick Start

Follow these steps to get the application running on your local machine.

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- A running instance of MySQL or MSSQL.

### 1. Configure the Database

Update the database connection details in `backend/src/main/resources/application.yml` for MySQL (the default) or `backend/src/main/resources/application-mssql.yml` for MSSQL.

**MySQL (`application.yml`):**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/testdb?useSSL=false
    username: root
    password: root
```

### 2. Start the Backend Server

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The server will start on `http://localhost:8081`.

*(To use MSSQL, run with the `mssql` profile: `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mssql"`)*

### 3. Start the Frontend App

```bash
cd frontend
npm install
npm run dev
```
The web application will be available at `http://localhost:5173`.

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| **Frontend** | React, Redux Toolkit, Vite, Bootstrap |
| **Backend** | Java 17, Spring Boot, Spring Data JPA |
| **Database** | MySQL, Microsoft SQL Server (MSSQL) |
| **Build Tools**| Maven (Backend), npm (Frontend) |

---

## 🏛️ Architecture

The application follows a classic client-server architecture.

```
graph TD
    subgraph Frontend["Frontend (React)"]
        UI["User Interface"]
        State["Redux State"]
        APIClient["API Client (Thunks)"]
    end

    subgraph Backend["Backend (Spring Boot)"]
        Controller["API Controller"]
        Service["Business Logic"]
        Repository["Data Repository"]
    end

    subgraph Database
        DB["MySQL / MSSQL"]
    end

    UI -- "User Action" --> APIClient
    APIClient -- "Updates" --> State
    State -- "Drives" --> UI

    APIClient -- "HTTP Request" --> Controller
    Controller --> Service
    Service --> Repository
    Repository -- "SQL" --> DB
```

1.  The **Frontend** is a single-page application built in React that handles user interaction.
2.  The **Backend** is a RESTful API built with Spring Boot that exposes endpoints for managing favorites.
3.  The **Database** stores the user's favorite places.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/favorites` | Add a new favorite place. |
| `GET` | `/api/favorites` | Get a list of all favorite places. |
| `DELETE`| `/api/favorites/{placeId}` | Remove a favorite by its Place ID. |
| `GET` | `/api/favorites/check/{placeId}` | Check if a place is already a favorite. |

---

## 💾 Database Schema

The `favorites` table stores the saved places. It is created automatically by Hibernate.

```sql
CREATE TABLE favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    place_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Future Improvements

- **User Authentication**: Allow users to sign up and have their own private list of favorites.
- **Categories**: Let users organize their favorites into lists like "Restaurants," "Parks," or "Vacation Ideas."
- **Add Notes**: Allow users to add personal notes to each favorite place.

