# Quick Start Guide - Mark as Favorite Feature

## ⚡ 5-Minute Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+
- MySQL or MSSQL database

---

## 🚀 Backend Setup

```bash
# Navigate to backend directory
cd backend

# Clean and build
mvn clean install

# Run with MySQL (default)
mvn spring-boot:run

# OR Run with MSSQL
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mssql"
```

**Backend runs on:** http://localhost:8081

---

## 🎨 Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# OR Build for production
npm run build
npm run preview
```

**Frontend runs on:** http://localhost:5173

---

## 📊 Database Setup

### MySQL (Default)

No additional setup needed! Hibernate will auto-create the table on first run.

**Connection details (application.yml):**
- URL: `jdbc:mysql://localhost:3306/testdb`
- Username: `root`
- Password: `root`

### MSSQL (Preferred)

Update `application-mssql.yml` with your connection:
```yaml
spring:
  datasource:
    url: jdbc:sqlserver://YOUR_SERVER:1433;databaseName=testdb
    username: sa
    password: YOUR_PASSWORD
```

Table will be auto-created by Hibernate.

---

## ✅ Testing the Feature

1. **Open browser:** http://localhost:5173
2. **Search for a place** using Google Places Autocomplete
3. **Click "Add to favorites"** button (heart icon)
4. **View favorites** in the "Favorite places" section
5. **Click on a favorite** to select it again
6. **Remove favorite** by clicking the button again

---

## 📁 What Was Created

### Backend (Java/Spring Boot)
```
✓ Favorite.java (JPA Entity)
✓ FavoriteRepository.java (Data Access)
✓ FavoriteService.java (Business Logic)
✓ FavoriteController.java (REST API)
✓ FavoriteRequest.java (Input DTO)
✓ FavoriteResponse.java (Output DTO)
✓ Updated database configs (MySQL + MSSQL)
```

### Frontend (React/Redux)
```
✓ useFavorite.js (Custom Hook)
✓ placeSlice.js (Redux Store - Updated)
✓ FavoriteButton.jsx (Component with HOC & Render Props)
✓ FavoritesList.jsx (Favorites Display)
✓ FavoriteStatusRenderer.jsx (Render Props Example)
✓ App.jsx (Updated Integration)
✓ index.html (Bootstrap Icons)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/favorites` | Add favorite |
| GET | `/api/favorites` | Get all |
| GET | `/api/favorites/{placeId}` | Get one |
| GET | `/api/favorites/check/{placeId}` | Check status |
| DELETE | `/api/favorites/{placeId}` | Remove |

---

## 🎯 React Patterns Used

✅ **Custom Hooks** - `useFavorite()` encapsulates favorite logic
✅ **Functional Components** - ES6 arrow functions & hooks
✅ **Higher-Order Components** - `withFavorite()` wrapper
✅ **Render Props** - `FavoriteButton` with render prop support
✅ **Redux Toolkit** - Async thunks for API calls
✅ **ES6+** - Modern JavaScript features throughout

---

## 🔍 Key Features

- ✅ Mark places as favorite with single click
- ✅ Persists to database (MySQL or MSSQL)
- ✅ Real-time favorite status updates
- ✅ View all favorites with coordinates
- ✅ Remove favorites
- ✅ Loading states & error handling
- ✅ Responsive design with Bootstrap
- ✅ Icons with Bootstrap Icons library

---

## 📝 Database Schema

```sql
-- Auto-created by Hibernate
CREATE TABLE favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    place_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check database connection in `application.yml`
- Ensure MySQL/MSSQL is running
- Check port 8081 is available

### Frontend can't reach backend
- Verify backend is running on 8081
- Check CORS is enabled in `FavoriteController`
- Check browser console for error details

### No favorites appearing
- Check browser Network tab for API calls
- Verify favorites were saved (check database directly)
- Clear browser cache and refresh

---

## 📚 For Detailed Documentation

See **`FAVORITES_FEATURE_GUIDE.md`** for:
- Complete architecture details
- Full API documentation
- React patterns explanation
- Database schema
- Performance optimizations
- Future enhancements

---

## ✨ Next Steps

1. ✅ Setup complete - Test the feature
2. 🔧 Customize UI/styling as needed
3. 🎓 Review `FAVORITES_FEATURE_GUIDE.md` for advanced details
4. 🚀 Deploy to production
5. 🌟 Add more features from "Future Enhancements" section

Happy coding! 🎉
