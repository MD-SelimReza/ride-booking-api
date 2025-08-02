````markdown
# 🚗 RideSphere - A Role-Based Ride Sharing Backend System

RideSphere is a scalable Node.js backend API for a ride-sharing platform, featuring role-based access for **Admins**, **Riders**, and **Drivers**. It includes ride request flows, driver approval processes, real-time ride status updates, and JWT-secured authentication.

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **Validation:** Zod
- **Authorization:** Role-based (Admin, Rider, Driver)
- **Architecture:** MVC + Layered Service Architecture

---

## 🚦 Features

### ✅ Authentication & Roles

- JWT-based login/registration
- Role support: `ADMIN`, `RIDER`, `DRIVER`
- Secure password hashing with `bcrypt`
- Blocked/suspended users restricted from actions

### ✅ Rider Functionalities

- Request a ride with pickup & destination
- Cancel a ride (before acceptance)
- View ride history

### ✅ Driver Functionalities

- Accept/reject ride requests
- Update ride status (Picked Up → In Transit → Completed)
- Set availability: Online / Offline
- View earnings

### ✅ Admin Functionalities

- View all users, drivers, rides
- Approve or suspend drivers
- Block/unblock user accounts

---

## 🧱 Models Overview

### User

```ts
{
  name, email, phone, password, role (ADMIN | RIDER | DRIVER),
  isBlocked, driver?: ObjectId
}
```
````

### Driver

```ts
{
  user: ObjectId,
  isApproved, driverStatus, earnings,
  vehicle: { type, model, plateNumber }
}
```

### Ride

```ts
{
  rider, driver?, pickupLocation, destinationLocation,
  status: requested → accepted → picked_up → in_transit → completed,
  fare, timestampsLog
}
```

---

## 📦 Installation

```bash
git clone https://github.com/your-username/ridesphere.git
cd ridesphere
npm install
```

## 🌐 Environment Setup

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ridesphere
JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES=30d
BCRYPT_SALT_ROUND=10
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123
```

---

## 🚀 Running the Server

```bash
# development mode
npm run dev

# production build
npm run build
npm start
```

---

## 🧪 API Testing with Postman

### Base URL:

```
https://ride-sphere-hazel.vercel.app/
```

### 🔐 Auth Routes

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Register as user  |
| POST   | `/auth/login`    | Login & get token |

---

### 👤 User Routes

| Method | Endpoint           | Access      |
| ------ | ------------------ | ----------- |
| POST   | `/users/register`  | Public      |
| GET    | `/users/all-users` | Admin only  |
| GET    | `/users/me`        | Logged in   |
| GET    | `/users/:id`       | Admin only  |
| PATCH  | `/users/:id`       | Owner/Admin |
| DELETE | `/users/:id`       | Admin only  |

---

### 🧍‍♂️ Driver Routes

| Method | Endpoint               | Access      |
| ------ | ---------------------- | ----------- |
| POST   | `/drivers/register`    | Driver only |
| PATCH  | `/drivers/status`      | Driver only |
| GET    | `/drivers/earnings`    | Driver only |
| PATCH  | `/drivers/approve/:id` | Admin only  |
| PATCH  | `/drivers/suspend/:id` | Admin only  |
| GET    | `/drivers/all-drivers` | Admin only  |

---

### 🚘 Ride Routes

| Method | Endpoint            | Access       |
| ------ | ------------------- | ------------ |
| POST   | `/rides/request`    | Rider only   |
| PATCH  | `/rides/cancel/:id` | Rider only   |
| PATCH  | `/rides/accept/:id` | Driver only  |
| PATCH  | `/rides/:id/status` | Driver only  |
| GET    | `/rides/me`         | Rider/Driver |
| GET    | `/rides/:id`        | Rider/Driver |
| GET    | `/rides/all-rides`  | Admin only   |

---

## 🧠 Business Logic Rules

- 🚫 **Drivers must be approved** by an admin before accepting rides
- 🚫 **Suspended or blocked** users cannot access routes
- 🧭 **Location stored with lat/lng and address**
- 🔄 Only one **active ride per rider/driver**
- 🕓 **Timestamps logged** for all status changes
- 🛑 Riders can only cancel before driver accepts

---

## 🧪 Test Data (Postman)

- Driver registration JSON:

```json
{
  "vehicle": {
    "type": "car",
    "model": "Toyota Axio",
    "plateNumber": "DHK-9876"
  }
}
```

- Ride request JSON:

```json
{
  "pickupLocation": {
    "lat": 23.8103,
    "lng": 90.4125,
    "address": "Gulshan, Dhaka"
  },
  "destinationLocation": {
    "lat": 23.75,
    "lng": 90.39,
    "address": "Dhanmondi, Dhaka"
  },
  "fare": 320
}
```

---

## 🧩 Folder Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── user/
│   │   ├── driver/
│   │   ├── ride/
│   │   └── auth/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
├── server.ts
```

---

## 🔐 Security

- Passwords hashed with Bcrypt
- JWT signed with secret & expiration
- Role-based route protection via middleware
- Input validation via Zod

---

## 👨‍💻 Author

**Selim Reza**
_Full Stack Web Developer_
Feel free to contribute or fork the project to extend it!
