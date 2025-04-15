# 🎓 Student Management System – Code Challenge

A full-stack TypeScript application that allows mocked authenticated users to **create**, **update**, **filter**, and **search** student records.  
Built with **Express**, **Knex**, **PostgreSQL**, **React**, **Redux Toolkit**, and **TypeScript**.

---

## 🚀 Features

### 📌 API Endpoints (Express + Knex)

#### 🔐 Authentication (Mocked)
- Middleware checks for a Bearer token in headers.
- Invalid or missing tokens return `401 Unauthorized`.

#### ➕ Create Student
- `POST /api/students`
- Creates a new student after validating required fields.
- Returns:
  - `201 Created` on success.
  - `400 Bad Request` for missing or malformed fields.

#### ✏️ Update Student
- `PATCH /api/students/:id`
- Accepts partial updates.
- Returns:
  - `200 OK` on success.
  - `400 Bad Request` for invalid input.
  - `404 Not Found` if student doesn’t exist.

#### 🔍 Query Students
- `GET /api/students`
- Supports filtering, fuzzy search, and sorting.
- Query Parameters:
  - `search`: string (name, city, state)
  - `minGpa` / `maxGpa`: number
  - `graduationYear`: number
  - `city`, `state`: string
  - `sortBy`: `name`, `gpa`, etc.

---

## 🧱 Database Schema

**Table: `students`**

| Field            | Type           | Required |
|------------------|----------------|----------|
| id               | integer (auto) | ✅       |
| name             | string         | ✅       |
| email            | string         | ✅       |
| graduation_year  | integer        | ✅       |
| phone_number     | string         | ✅       |
| gpa              | decimal(3,2)   | ✅       |
| city             | string         | ✅       |
| state            | string         | ✅       |
| latitude         | decimal(10,7)  | ✅       |
| longitude        | decimal(10,7)  | ✅       |
| created_at       | timestamp      | ✅       |

---

## 🖥️ Frontend (React + Redux Toolkit)

### 🧾 Dynamic Form
- Uses a shared `fields` array to render and validate all inputs.
- Fields:
  - `name`, `email`, `graduation_year`, `phone_number`, `gpa`, `city`, `state`, `latitude`, `longitude`

### 🔁 Create / Edit Logic
- Pre-fills form on edit.
- Button label switches from “Add Student” to “Update Student”.
- Only modified fields are sent in the PATCH request.

### 📊 Student List View
- Displays all student details in a clean grid:
  - Name, GPA, Graduation Year, Location, Contact Info, Date Created.

### 📂 Filter Navbar
- Component allows real-time search/filtering via Redux `fetchStudents()`.

---

## ⚙️ Utilities

### 📡 `restCall` Axios Wrapper
- Supports:
  - Auth token injection
  - JSON / FormData detection
  - Centralized error handling

---

## 🐳 Dev Setup

### ✅ Local Development Instructions
1. Clone this repo to your own machine (do not fork it)
2. Run `docker-compose up -d` to start all services
4. Run Migration Script
4. Run Student seed data: docker-compose exec api npx ts-node --transpile-only ./node_modules/knex/bin/cli.js seed:run --knexfile src/db/knexfile.ts
6. Visit [http://localhost:5173](http://localhost:5173)