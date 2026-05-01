# 🎓 EduFlow - Course Management Platform

**EduFlow** is a modern backend REST API designed for a course-selling ecosystem. It provides a secure, scalable architecture for administrators to manage curriculum and for students to browse and purchase educational content.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Separate authentication flows and middleware for Admins and Users using JWT.
* **Secure Password Hashing:** Implementation of **bcrypt** to ensure user and admin passwords are encrypted before being stored in the database.
* **Data Integrity with Zod:** Strict schema validation for all incoming requests to prevent malformed data entry.
* **Optimized Data Modeling:** Transitioned from a flat database structure to a relational model using Mongoose `ObjectIds` and `.populate()` for efficient data retrieval.
* **Atomic Transactions:** Uses MongoDB operators like `$addToSet` to handle course purchases, preventing duplicate records.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Validation:** Zod
- **Security:** **bcrypt** (Password Hashing), JSON Web Tokens (JWT), Dotenv for environment management
- **Testing Tools:** Postman for API endpoint verification

---

## 📂 Database Architecture

The project emphasizes a relational approach within a NoSQL environment to ensure a clean "Single Source of Truth":

- **Admin Collection:** Manages credentials for course creators.
- **Course Collection:** Stores course metadata (title, price, image) and links to the creator via `adminId`.
- **User Collection:** Stores student profiles and maintains an array of purchased courses using `ref: "course"`.

---

## 🚦 API Endpoints

### Admin Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/admin/signup` | Register a new administrator (Password hashed with bcrypt) |
| `POST` | `/admin/login` | Authenticate and receive Admin JWT |
| `POST` | `/admin/course` | Create a new course (Protected) |
| `PUT` | `/admin/course` | Update existing course details (Protected) |
| `GET` | `/admin/course` | View all created courses (Protected) |

### User Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/user/signup` | Register a new student (Password hashed with bcrypt) |
| `POST` | `/user/login` | Authenticate and receive User JWT |
| `GET` | `/user/courses` | View all purchased courses |

### Course Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/course/` | View all available courses |
| `POST` | `course/purchase` | Enroll in a course (Relational Update) |
---

## 🛠️ Installation & Setup

1. **Clone the Repo:**
   ```bash
   git clone [https://github.com/raj-hars/EduFlow]
   ```

2. **Install Packages:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file:
   ```env
   MONGO_URL=your_connection_string
   JWT_ADMIN_SECRET=your_admin_secret
   JWT_USER_SECRET=your_user_secret
   ```

4. **Boot the Server:**
   ```bash
   node index.js
   ```

---