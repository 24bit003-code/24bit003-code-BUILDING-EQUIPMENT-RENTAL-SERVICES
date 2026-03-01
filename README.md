# 24bit003-code-BUILDING-EQUIPMENT-RENTAL-SERVICES

## Deployment (Render + Vercel)

### 1. Deploy backend (Render)

- Create a new **Web Service** from this repo.
- Root directory: `BACKEND/equipment`
- Build command: `bash build.sh`
- Start command: `gunicorn equipment.wsgi:application`
- Environment variables:
  - `SECRET_KEY` = any strong random string
  - `DATABASE_URL` = Render PostgreSQL connection string
  - `FRONTEND_ORIGINS` = your frontend URL (comma-separated if many), e.g. `https://your-app.vercel.app`

### 2. Deploy frontend (Vercel)

- Import the same repo into Vercel.
- Root directory: `Front`
- Build command: `npm run build`
- Output directory: `build`
- Environment variable:
  - `REACT_APP_API_BASE_URL` = your Render backend URL, e.g. `https://your-backend-service.onrender.com`

### 3. Re-deploy frontend after backend URL is ready

- Once backend is live, update `REACT_APP_API_BASE_URL` in Vercel and redeploy.
