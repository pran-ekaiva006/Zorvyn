# Zorvyn Backend API

A robust, secure, and easily scalable backend service for tracking personal or organizational finances. Built with Node.js and Express, it features custom JWT-based Role-Based Access Control (RBAC), robust request validation using Zod, and centralized exception handling for maximum resilience.

---

## 🚀 Project Overview

Zorvyn relies on a unified Express architecture targeting secure financial tracking. 

**Key Features:**
*   **Authentication & Authorization:** JWT-driven auth integrated with extensible Role-Based Access Control (`admin`, `analyst`, `viewer`).
*   **Data Integrity:** Input fields are validated by rigorous Zod schemas before touching lower-level architecture.
*   **Centralized Error Handling:** Global error catching removes redundant `try/catch` checks, forwarding all validation errors securely to a normalized API response structure.
*   **Safe Data Practices:** "Soft deletion" ensures that transactional tracking and audits remain intact when deleted.
*   **Scalability:** Implements data pagination to reliably scale analytical dashboards natively handling high-volume datasets.

---

## 🛠 Tech Stack

*   **Runtime Framework**: Node.js & Express API
*   **Database**: MongoDB via Mongoose ORM
*   **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
*   **Schema Validation**: Zod
*   **Routing & Modularity**: Express Router

---

## 💻 Setup Instructions

Follow these steps to set up the project locally:

**1. Clone the repository**
```bash
git clone https://github.com/pran-ekaiva006/Zorvyn.git
cd Zorvyn
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env` file in the root of the project with the following (or use existing):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster...
JWT_SECRET=YourSuperSecretKeyHere
```

**4. Seed the Database (Optional but Recommended)**
Pre-populate the database with a user for each role and sample transactional data.
```bash
node seed.js
```

**5. Start the Application**
```bash
# Run in development mode (auto-refresh)
npm run dev

# Run in production mode
npm start
```
The server will default to mapping onto `http://localhost:5000`.

---

## 🌐 API Endpoints

### Auth
*   `POST /api/auth/register` — Register a new user (Body: `name`, `email`, `password`, `role`).
*   `POST /api/auth/login` — Sign in and securely return a JWT.

### Transactions
*   `POST /api/transactions` — Create a new financial record. *(Requires `admin` role)*
*   `GET /api/transactions` — Fetch paginated transactions (`?page=1&limit=10`). *(Requires `admin` or `analyst` role)*
*   `DELETE /api/transactions/:id` — Safely soft-delete a transaction. *(Requires `admin` role)*

### Dashboards
*   `GET /api/dashboard/summary` — Overview of income vs. expenses.
*   `GET /api/dashboard/category` — Categorical breakdown.
*   `GET /api/dashboard/trends` — Month-by-month financial trends.

### Users
*   `GET /api/users` — Fetch all users in the system.
*   `GET /api/users/:id` — Fetch specific user.
*   `PUT /api/users/:id` — Update user permissions or details.
*   `DELETE /api/users/:id` — Delete a user.

---

## 🧠 Design Decisions

1.  **Centralized Error Handling Architecture:** Transitioned away from explicit repetitive `try/catch` statements scattered within controllers. An `AppError` tracking class acts alongside an `asyncHandler` logic wrapper to guarantee uniform, easily debugged, structured JSON returns for everything from Zod payloads down to Mongoose cast limits.
2.  **Controller & Validation decoupling:** Separated functional controller actions from raw validation using specialized Zod schema middleware. Controllers now focus uniquely on business logic. 
3.  **Soft Deletion Over Destructive Mutating:** Deleting transactions inherently masks the row rather than performing irreversible dropping. This helps ensure compliance against accidental data loss or ledger scrubbing. 
4.  **Flexible Pagination Standards:** Included standardized page counts natively outputting directly into JSON response boundaries, preventing high-bandwidth lag before frontend clients try querying over extensive ledger history.

---

## 👨‍💻 Author

**Pranjal Kumar Verma**
*   [GitHub Profile](https://github.com/pran-ekaiva006)
