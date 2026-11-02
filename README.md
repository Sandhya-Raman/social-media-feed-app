# Connect – Social Media Feed Application

## Project Overview

Connect is a full-stack Social Media Feed Application developed using the MERN Stack (MongoDB, Express.js, React.js and Node.js).

The application allows users to register, log in, create posts, upload images, like and unlike posts, and interact with other users through comments.

## Technologies Used

**Frontend**
- React.js
- Vite
- HTML
- CSS
- Axios
- React Router DOM

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer

## Features

1. User Registration
2. User Login and Authentication
3. Protected Home Feed
4. Create Text Posts
5. Upload and Display Images
6. Like and Unlike Posts
7. Add and View Comments
8. User Logout
9. Responsive User Interface
10. MongoDB Database Integration

## Project Structure

```text
social-media-feed-app/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sandhya-Raman/social-media-feed-app.git
```

### 2. Navigate to the Project

```bash
cd social-media-feed-app
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Application Modules

| Module | Description |
|---|---|
| Authentication | User registration and login |
| Social Feed | Displays posts from users |
| Post Management | Creates text and image posts |
| Image Upload | Uploads images using Multer |
| Likes | Supports like and unlike operations |
| Comments | Allows users to add and view comments |
| Database | Stores user, post and comment information |

## Learning Outcomes

- Understanding MERN Stack development.
- Building RESTful APIs using Express.js.
- Implementing JWT-based authentication.
- Connecting React frontend with backend APIs.
- Working with MongoDB Atlas.
- Implementing image uploads using Multer.
- Managing frontend state using React Hooks.
- Integrating CRUD-related application functionality.

## Author

**Sandhya R**

M.Sc. Computer Science

## Project Type

Full Stack Web Development – Internship Major Project