# Transparent Fund Tracking System (TFTS)

A **blockchain-enabled web application** designed to ensure **transparency, accountability, and traceability** in government and public fund utilization.

---

## 📌 Problem Statement

In traditional fund management systems, lack of transparency leads to:

* Misuse of public funds
* Delayed reporting
* Limited public access to fund utilization data

There is **no immutable system** to verify where and how funds are spent.

---

## 🎯 Objective

The objective of TFTS is to:

* Track fund allocation and utilization in real time
* Record transactions on blockchain for **tamper-proof history**
* Provide **role-based access** for Admin, Utilization Officers, and Public users
* Increase public trust in government fund distribution

---

## 🏗️ System Architecture

The system follows a  **modular architecture** :

* **Frontend:** User interface for fund tracking and operations
* **Backend:** REST APIs for business logic and data handling
* **Blockchain Layer:** Smart contracts for secure transaction records
* **Database:** Stores user data, schemes, and transaction logs

---

## 🔑 Key Features

* ✅ Role-based authentication (Admin / Utilization / Public)
* ✅ Fund allocation and scheme management
* ✅ Blockchain-based transaction recording
* ✅ Public fund tracking dashboard
* ✅ Grievance reporting system
* ✅ Immutable transaction history
* ✅ Secure wallet integration (MetaMask)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Blockchain

* Ethereum
* Solidity
* Hardhat / Ganache
* MetaMask

### Tools & Platforms

* VS Code
* Postman
* GitHub
* Netlify (Frontend Deployment)
* Render (Backend Deployment)

---

## 🔐 User Roles

### 👨‍💼 Admin

* Add government schemes
* Allocate funds
* View transaction history
* Manage utilization requests

### 🏢 Utilization Officer

* Submit fund utilization details
* Upload proof documents
* Track approval status

### 🌐 Public User

* View schemes and fund usage
* Track transaction transparency
* Submit grievances

---

## 🔄 Workflow

1. Admin creates a scheme and allocates funds
2. Transaction is recorded on blockchain
3. Utilization officer requests fund usage
4. Approval updates are logged
5. Public users can view fund utilization details.

---

## 🚀 Deployment (run on a server or another machine)

Follow these steps to make the app reachable from other machines on the network or a server:

- **Backend env vars:** create a `.env` in `backend/` or set env vars in your host:
	- `PORT` (default `5000`)
	- `HOST` (optional — defaults to `0.0.0.0` to allow LAN access)
	- `CORS_ORIGIN` (comma-separated origins or `*` to allow all)
	- `MONGO_URI` (your MongoDB connection string)
	- `SERVE_FRONTEND=true` to let the backend serve the built frontend from `frontend/build`.

- **Frontend:** set the API base at build time (optional). If your frontend is served from the same host as the backend, no extra step is required. To point the frontend to a different backend, set:
	- `REACT_APP_API_URL` (e.g. `https://api.example.com`)

- **Build & run (example single-server deploy):**

```powershell
cd frontend
npm install
npm run build

cd ../backend
npm install
setx PORT 5000
setx HOST 0.0.0.0
setx SERVE_FRONTEND true
node server.js
```

- You can now access the site from another machine using `http://<server-ip>:5000` (or your configured port).

---

If you want help creating a small script or a hosting-specific guide (Render, DigitalOcean, or Netlify + Render combo), tell me which provider and I'll add tailored steps.

---

## Vercel Deployment (Frontend)

Recommended: host the frontend on Vercel and the backend on Render/Render-like service. This avoids converting the Express API to serverless functions.

1. Push your repo to GitHub.
2. In the Vercel dashboard, import the project from GitHub and select the `frontend/` directory as the root (or connect the monorepo and set root to `frontend`).
3. Set Environment Variables in Vercel → Settings → Environment Variables:
	- `REACT_APP_API_URL` = `https://<YOUR_BACKEND_DOMAIN>` (if you want the frontend to call backend directly), or leave blank if backend is served from same origin.
4. Build & Output:
	- Build Command: `npm run build`
	- Output Directory: `build`
5. Optionally add a `vercel.json` in `frontend/` to rewrite `/api/*` to your backend domain. Example `frontend/vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }],
  "rewrites": [{ "source": "/api/(.*)", "destination": "https://<YOUR_BACKEND_DOMAIN>/api/$1" }]
}
```

6. Deploy — Vercel will build and publish the frontend. If you used rewrites to a backend on Render, the frontend can call `/api/*` and Vercel will proxy requests to the backend.

If you want, I can: (A) add the `vercel.json` under `frontend/` and update `.gitignore`, (B) prepare a Render deploy guide for the backend, or (C) attempt to refactor the backend to Vercel serverless functions (more involved). Which one do you want next?
