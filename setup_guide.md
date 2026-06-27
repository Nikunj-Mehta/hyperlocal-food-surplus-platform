# Setup Guide: Hyperlocal Food Surplus Platform

Follow these step-by-step instructions to get the platform up and running on your local machine.

## Prerequisites

Before starting, ensure you have the following installed on your system:
- **Node.js** (v18+ recommended)
- **MongoDB Server** (running locally, or use a MongoDB Atlas cloud URL)
- **Git**

---

## 1. Clone the Project
Open your terminal and clone the repository (if you haven't already), then navigate into it:
```bash
git clone <repository-url>
cd hyperlocal-food-surplus-platform
```

---

## 2. Setup the Backend

1. Navigate to the `Backend` directory:
```bash
cd Backend
```

2. Install all backend dependencies:
```bash
npm install
```

3. Create an environment variables file. Create a file named `.env` in the `Backend` folder with the following keys. Fill in the values appropriately:
```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/hyperlocal-food-surplus
JWT_SECRET=Qk1Qb3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3g=
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME= dvlmotdjt
CLOUDINARY_KEY= 628253562379461
CLOUDINARY_SECRET= iVDAR5-6Zru7M39iPYYKfSgvp1o
```

4. Start the backend server:
```bash
npm start
```
*(If you want it to restart automatically upon changes during development, use `npm run dev` or `node server.js` depending on your package.json scripts).* 
You should see: "Server is running on port 8080" and "Connected to MongoDB".

---

## 3. Setup the Frontend

1. Open a **new terminal window/tab** and navigate to the `Frontend` directory from the project root:
```bash
cd Frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```

4. The terminal will give you a local URL (usually `http://localhost:5173/`). Open this in your browser to view the application!

---

## Tips & Troubleshooting
- **Cloudinary Setup**: The app uses Cloudinary for saving images. You can sign up for a free account at [cloudinary.com](https://cloudinary.com) to get your credentials for the `.env` file. If you don't provide them, the app attempts to fall back to local disk storage in an `uploads/food-surplus/` folder.
- **MongoDB**: Ensure your local MongoDB server is active before starting the backend, otherwise the node server will crash with connection errors. If you use MongoDB Compass, connect to `localhost:27017` to view your data.
