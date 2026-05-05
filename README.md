# Hospital Management

This repository contains a hospital management backend and frontend project.

## Structure

- `backend/` - Express REST API for patients, doctors, and appointments.
- `frontend/` - React + Vite dashboard for viewing hospital data.

## Setup

From the repository root:

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

3. Start the backend:

   ```bash
   npm start
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open the Vite app at `http://localhost:5173`.

## API Endpoints

- `GET /api/patients`
- `POST /api/patients`
- `GET /api/doctors`
- `POST /api/doctors`
- `GET /api/appointments`
- `POST /api/appointments`
