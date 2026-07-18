# Quick Start Guide

## Setup

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend starts on http://localhost:8081.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on http://localhost:5173.

## Database
The app supports MySQL and MSSQL. The default connection is configured in `backend/src/main/resources/application.yml`.

If you need MSSQL, update `backend/src/main/resources/application-mssql.yml` and run with:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mssql"
```

## Use the Feature
1. Open http://localhost:5173
2. Search for a place
3. Click the favorite button or remove it
4. Check the favorite list on the page

## API Endpoints
- `POST /api/favorites` — add favorite
- `GET /api/favorites` — get all favorites
- `GET /api/favorites/{placeId}` — get favorite by placeId
- `GET /api/favorites/check/{placeId}` — check favorite status
- `DELETE /api/favorites/{placeId}` — remove favorite

## Notes
- The backend uses Spring Boot with JPA and Hibernate.
- The frontend uses React with Redux Toolkit.
- The favorite list is stored in the database and loaded on request.
