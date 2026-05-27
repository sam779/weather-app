# Weather App

A full-stack web application that allows users to log in, search for current weather by city, and receive real-time messages targeted at their selected city.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Socket.IO client
- **Backend:** Node.js, Express 5, TypeScript, Socket.IO, JWT, bcrypt

## Notes for Reviewer

- **Authentication** is handled via JWT. Passwords are hashed with bcrypt. The token is stored in `localStorage` and attached as a `Bearer` token on every protected request.
- **Protected routes** are enforced on both ends — the backend rejects requests without a valid JWT (`/weather`, `/messages`), and the frontend redirects unauthenticated users away from `/home`.
- **Real-time messaging** uses Socket.IO rooms. When a user selects a city, they join a room keyed to that city. Messages posted to `/messages` are emitted only to clients in the matching room.
- **City normalisation** (`trim → lowercase → strip commas → hyphenate spaces`) runs on both ends to ensure the room name the client joins always matches the room the server targets.
- **In-memory storage** is used as permitted by the challenge requirements — there is no database.
- The demo credentials are `admin` / `password123`.

## Setup

### Environment variables

Copy `.env.example` to `.env` inside the `backend` folder and fill in the values:

```env
WEATHER_API_KEY=6b55d3fdd3f8f4adbe11a711b31f09d4
JWT_SECRET=< use "openssl rand -hex 32" to generate a secure random string >
DEMO_PASSWORD=password123
DEMO_PASSWORD_HASH=< run "node .\backend\scripts\passwordHash.js" to generate a bcrypt hash of the demo password >
PORT=3000
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Test Workflow

### 1. Authenticate

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "admin",
    "password": "password123"
}'
```

Response:
```json
{
    "token": "<TOKEN>"
}
```

### 2. Open the app and select a city

Navigate to `http://localhost:5173`, log in with the demo credentials, and search for a city (e.g. `Melbourne, AU`). This joins the Socket.IO room for that city.

### 3. Push a live message to that city

Replace `<TOKEN>` with the value from step 1:

```bash
curl --location 'http://localhost:3000/messages' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "city": "Melbourne, AU",
    "message": "Storm warning"
}'
```

Response:
```json
{
    "success": true
}
```

The message appears as a popup in the browser for any user currently viewing that city. It auto-dismisses after 5 seconds.
