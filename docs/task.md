# Tasks - ParkItNow Smart Parking Reservation Platform

Use this checklist to track development progress throughout the lifecycle of the project.

## Core Milestones

### 1. Database & Server Infrastructure
- [ ] Initialize git repository and make initial commit.
- [ ] Install dependencies on server workspace (`express`, `mongoose`, `dotenv`, `cors`).
- [ ] Setup MongoDB Atlas cluster and acquire connection URI.
- [ ] Connect database inside `server/src/config/db.js`.
- [ ] Implement global error handling middleware.

### 2. User Authentication (JWT)
- [ ] Create `User` Mongoose model.
- [ ] Implement registration controller with bcrypt password hashing.
- [ ] Implement login controller generating JWT tokens.
- [ ] Create authentication and role verification middlewares (`protect`, `restrictTo`).
- [ ] Add profile retrieval endpoint (`GET /api/v1/auth/me`).

### 3. Parking Spot Management
- [ ] Create `ParkingSpot` Mongoose model with geospatial index on `location`.
- [ ] Develop `POST /api/v1/spots` (restrict to `spot_owner`/`admin`).
- [ ] Build search functionality using Mongo Geospatial `$near` queries (`GET /api/v1/spots`).
- [ ] Implement update/delete controllers for spot owners.

### 4. Reservation System
- [ ] Create `Reservation` Mongoose model.
- [ ] Build checking algorithm for overlapping reservations.
- [ ] Implement `POST /api/v1/reservations` creating reservations with `status: 'pending'`.
- [ ] Add reservation querying endpoints for driver dashboards.

### 5. Stripe Payment Integration
- [ ] Create Stripe account and get developer API keys.
- [ ] Implement `POST /api/v1/payments/create-intent` endpoint.
- [ ] Implement Stripe webhook receiver in Express to listen for payment success.
- [ ] Transition reservation status to `confirmed` automatically on payment success.

### 6. React Frontend Scaffolding
- [ ] Install react-router-dom, Tailwind/Vanilla CSS, and Axios.
- [ ] Configure global router with Public, Protected, and Role-restricted route components.
- [ ] Implement AuthContext for persistent JWT session management.

### 7. Frontend Pages & Map Integration
- [ ] Build home landing page with layout and search input.
- [ ] Integrate Mapbox GL Map view rendering nearby spots on map markers.
- [ ] Create Detail view modal displaying availability, reviews, pricing, and photo gallery.
- [ ] Create Booking form triggering the Stripe Elements overlay.
- [ ] Setup Dashboard interfaces for Drivers (bookings list) and Spot Owners (spot earnings/slots).
