# Favorite Places Feature Implementation

## Overview

This document describes the complete implementation of the "Mark as Favorite" feature for the Accord Innovations Places Explorer application. The feature allows users to mark places as favorites, which are persisted to a database and displayed in the application.

## Architecture

### Database Schema

**Favorites Table:**
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

### Backend Stack
- **Framework:** Spring Boot 3.3.2
- **ORM:** Spring Data JPA (Hibernate)
- **Databases:** MySQL, MSSQL
- **Java Version:** 17

### Frontend Stack
- **Framework:** React 18.3.1
- **State Management:** Redux Toolkit (with async thunks)
- **Patterns:** Custom Hooks, Functional Components, HOC, Render Props
- **Build Tool:** Vite 5.4.10

---

## Backend Implementation

### 1. **Entity Model** - `Favorite.java`

JPA entity representing a favorited place:
- `id`: Primary key (auto-generated)
- `placeId`: Unique identifier from Google Places API
- `name`, `address`, `latitude`, `longitude`: Place information
- `createdAt`: Timestamp of when the place was favorited

### 2. **Repository** - `FavoriteRepository.java`

Spring Data JPA repository providing database access:

```java
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByPlaceId(String placeId);
    List<Favorite> findAllByOrderByCreatedAtDesc();
    void deleteByPlaceId(String placeId);
    boolean existsByPlaceId(String placeId);
}
```

**Key Methods:**
- `findByPlaceId()`: Retrieve a single favorite by place ID
- `findAllByOrderByCreatedAtDesc()`: Get all favorites sorted by creation date
- `existsByPlaceId()`: Check if a place is favorited

### 3. **Service Layer** - `FavoriteService.java`

Business logic for managing favorites:

```java
public FavoriteResponse addFavorite(FavoriteRequest request)
public List<FavoriteResponse> getAllFavorites()
public FavoriteResponse getFavoriteByPlaceId(String placeId)
public void removeFavorite(String placeId)
public boolean isFavorited(String placeId)
```

**Features:**
- Prevents duplicate favorites (unique constraint on placeId)
- Exception handling with meaningful error messages
- DTO conversion for API responses

### 4. **Controller** - `FavoriteController.java`

RESTful API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/favorites` | Add a new favorite |
| GET | `/api/favorites` | Get all favorites |
| GET | `/api/favorites/{placeId}` | Get favorite by place ID |
| GET | `/api/favorites/check/{placeId}` | Check if place is favorited |
| DELETE | `/api/favorites/{placeId}` | Remove favorite |

**CORS Configuration:** `@CrossOrigin(origins = "*", maxAge = 3600)` enables cross-origin requests from the frontend.

### 5. **DTOs** - `FavoriteRequest.java` & `FavoriteResponse.java`

- **FavoriteRequest:** Input validation for adding favorites
- **FavoriteResponse:** Standardized API response format

---

## Frontend Implementation

### 1. **Custom Hook** - `useFavorite.js`

Modern React custom hook for favorite management:

```javascript
export const useFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Key functions:
  const addFavorite = useCallback(async (place) => { ... });
  const removeFavorite = useCallback(async (placeId) => { ... });
  const isFavorited = useCallback((placeId) => { ... });
  const fetchFavorites = useCallback(async () => { ... });
  const checkFavoriteStatus = useCallback(async (placeId) => { ... });

  return { favorites, loading, error, addFavorite, removeFavorite, ... };
};
```

**Benefits:**
- Encapsulates favorite state management
- Reusable across components
- Proper error handling and loading states
- useCallback optimization for performance

### 2. **Redux Store** - `placeSlice.js`

Redux Toolkit slice with async thunks for favorites:

```javascript
// Async Thunks:
- selectPlaceAsync: Select a place from search
- saveFavoriteAsync: Add place to favorites
- removeFavoriteAsync: Remove place from favorites
- fetchAllFavoritesAsync: Fetch all saved favorites
- checkFavoriteStatusAsync: Check if current place is favorited

// State:
{
  currentPlace: null,
  searchHistory: [],
  favorites: [],
  status: 'idle',
  error: null,
  favoriteStatus: 'idle',
  favoritesStatus: 'idle',
  isFavorited: false,
}
```

### 3. **Components**

#### **FavoriteButton.jsx** - Favorite Toggle Component

Demonstrates multiple React patterns:

```javascript
/**
 * Patterns Implemented:
 * 1. Functional Component with Hooks
 * 2. Render Props Pattern
 * 3. Higher-Order Component (HOC) Pattern
 */

// Usage:
<FavoriteButton
  place={currentPlace}
  isFavorited={isFavorited}
  loading={loading}
  onFavoriteToggle={handleToggle}
  renderProp={(status) => <CustomUI {...status} />}
/>
```

**Features:**
- Toggles favorite status
- Shows loading state with spinner
- Supports render props for flexible UI
- HOC wrapper `withFavorite()` for component enhancement

#### **FavoritesList.jsx** - Display Favorites

Displays all favorited places:

```javascript
<FavoritesList 
  maxItems={5}
  onSelectFavorite={handleSelectFavorite}
/>
```

**Features:**
- Fetches all favorites from backend
- Displays coordinates with precision
- Pagination support via maxItems prop
- Click handler for selecting favorites

#### **FavoriteStatusRenderer.jsx** - Render Props Example

Pure render props pattern component:

```javascript
<FavoriteStatusRenderer
  isFavorited={isFavorited}
  loading={loading}
  renderProp={(status) => (
    <span className={`badge ${status.badgeClass}`}>
      <i className={`bi bi-${status.icon}`} />
      {status.label}
    </span>
  )}
/>
```

### 4. **UI Integration** - `App.jsx`

Main application component integrating all favorite features:

```javascript
// Key Features:
- Check favorite status when place changes
- Toggle favorite on button click
- Display favorite indicator badge
- Show favorites list with count
- Handle loading and error states
- Select from favorites history
```

---

## React Patterns Demonstrated

### 1. **Custom Hooks**
```javascript
const { favorites, addFavorite, removeFavorite } = useFavorite();
```
- Encapsulates logic
- Reusable across components
- Separation of concerns

### 2. **Higher-Order Component (HOC)**
```javascript
export const withFavorite = (WrappedComponent) => {
  return function FavoriteEnhancedComponent(props) {
    return <WrappedComponent {...props} />;
  };
};
```
- Adds favorite capability to any component
- Props wrapping pattern

### 3. **Render Props Pattern**
```javascript
<FavoriteButton renderProp={(status) => (
  <CustomUI {...status} />
)} />
```
- Highly flexible UI composition
- Decouples logic from UI

### 4. **Functional Components with Hooks**
```javascript
const MyComponent = () => {
  const [state, setState] = useState();
  useEffect(() => { ... }, []);
  return <JSX />;
};
```
- Modern React approach
- Hooks for state and side effects
- Cleaner code compared to class components

---

## API Integration

### Base URL
```
http://localhost:8081/api/favorites
```

### Request/Response Examples

**Add Favorite:**
```bash
POST /api/favorites
Content-Type: application/json

{
  "placeId": "ChIJN1blQLgOZkgRqstts5IHx8c",
  "name": "Google Sydney",
  "address": "Sydney NSW 2000, Australia",
  "latitude": -33.866,
  "longitude": 151.193
}

Response (201 Created):
{
  "id": 1,
  "placeId": "ChIJN1blQLgOZkgRqstts5IHx8c",
  "name": "Google Sydney",
  "address": "Sydney NSW 2000, Australia",
  "latitude": -33.866,
  "longitude": 151.193,
  "createdAt": "2026-07-18T16:00:00"
}
```

**Get All Favorites:**
```bash
GET /api/favorites

Response (200 OK):
[
  { /* favorite object */ },
  { /* favorite object */ }
]
```

**Check Favorite Status:**
```bash
GET /api/favorites/check/ChIJN1blQLgOZkgRqstts5IHx8c

Response (200 OK):
{
  "placeId": "ChIJN1blQLgOZkgRqstts5IHx8c",
  "isFavorited": true
}
```

**Remove Favorite:**
```bash
DELETE /api/favorites/ChIJN1blQLgOZkgRqstts5IHx8c

Response (200 OK):
{
  "message": "Favorite removed successfully"
}
```

---

## Database Configuration

### MySQL (Default)

**application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/testdb?useSSL=true&requireSSL=false&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
```

**Run with:** `java -jar backend.jar`

### MSSQL (Preferred for Production)

**application-mssql.yml:**
```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=testdb;encrypt=true;trustServerCertificate=true
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
    username: sa
    password: YourPassword@1234
  jpa:
    database-platform: org.hibernate.dialect.SQLServerDialect
```

**Run with:** `java -jar backend.jar --spring.profiles.active=mssql`

---

## Setup & Running

### Backend Setup

1. **Build:**
   ```bash
   cd backend
   mvn clean install
   ```

2. **Run with MySQL (default):**
   ```bash
   mvn spring-boot:run
   ```

3. **Run with MSSQL:**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mssql"
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Development mode:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## Testing the Feature

### Manual Testing Steps

1. **Start Backend:**
   ```bash
   mvn spring-boot:run
   ```
   (Backend runs on http://localhost:8081)

2. **Start Frontend:**
   ```bash
   npm run dev
   ```
   (Frontend runs on http://localhost:5173)

3. **Test Flow:**
   - Open http://localhost:5173 in browser
   - Search for a place using Google Autocomplete
   - Place appears on map and in details panel
   - Click "Add to favorites" button
   - Favorite should be saved to database
   - Check "Favorite places" section - new place should appear
   - Navigate away and return - favorite should persist
   - Click "Remove from favorites" to delete
   - Refresh page - favorite should be gone

---

## Error Handling

### Backend Errors

- **409 Conflict:** Place already marked as favorite
- **404 Not Found:** Favorite doesn't exist for given placeId
- **400 Bad Request:** Missing or invalid fields

### Frontend Error Handling

- User-friendly error messages displayed in alerts
- Automatic retry capability
- Loading states prevent duplicate requests
- Disabled buttons during operations

---

## Performance Optimizations

1. **Frontend:**
   - `useCallback` for memoized callbacks
   - Redux selectors for component re-render optimization
   - Efficient list rendering with keys

2. **Backend:**
   - Database indexes on `placeId` (unique)
   - JPA query optimization
   - Stateless API design

3. **Network:**
   - Async/await for non-blocking operations
   - Efficient API payloads
   - CORS pre-flight caching

---

## File Structure

```
accordinnovations/
├── backend/
│   ├── src/main/java/com/accordinnovations/backend/
│   │   ├── model/
│   │   │   └── Favorite.java
│   │   ├── repository/
│   │   │   └── FavoriteRepository.java
│   │   ├── service/
│   │   │   └── FavoriteService.java
│   │   ├── controller/
│   │   │   └── FavoriteController.java
│   │   └── dto/
│   │       ├── FavoriteRequest.java
│   │       └── FavoriteResponse.java
│   └── src/main/resources/
│       ├── application.yml
│       ├── application-mssql.yml
│       └── application-azuremysql.yml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FavoriteButton.jsx
│   │   │   ├── FavoritesList.jsx
│   │   │   ├── FavoriteStatusRenderer.jsx
│   │   │   └── PlaceAutocomplete.jsx
│   │   ├── hooks/
│   │   │   └── useFavorite.js
│   │   ├── store/
│   │   │   ├── placeSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
```

---

## Future Enhancements

1. **User Authentication:** Add user-specific favorites
2. **Favorites Export:** Download favorites as CSV/JSON
3. **Sharing:** Share favorite places with others
4. **Categories:** Organize favorites into categories
5. **Notes:** Add personal notes to favorites
6. **Maps Integration:** Show all favorites on map simultaneously
7. **Search:** Filter favorites by name/address
8. **Sorting:** Sort favorites by creation date, name, etc.
9. **Offline Support:** Service workers for offline access
10. **Mobile App:** React Native version

---

## Dependencies

### Backend
- Spring Boot 3.3.2
- Spring Data JPA
- MySQL Connector (8+)
- MSSQL JDBC Driver
- Jakarta Validation

### Frontend
- React 18.3.1
- Redux Toolkit 2.2.5
- React-Redux 9.2.0
- Bootstrap 5.3.3
- Vite 5.4.10

---

## License & Support

This implementation is part of the Accord Innovations Places Explorer project.

For issues or questions, please contact the development team.
