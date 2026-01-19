# Hyperlocal Community Food Surplus Exchange Platform 🍱🌍

A MERN stack–based web application designed to reduce food wastage by connecting surplus food donors with nearby receivers in a hyperlocal community. The platform enables real-time food listings, location-based discovery, and sustainable handling of organic waste through composting.

---

## 📌 Project Overview

Food wastage and hunger often coexist due to the absence of a simple, real-time, and location-based food sharing system. This project aims to bridge that gap by providing a community-driven platform where individuals, restaurants, mess services, and event organizers can donate surplus food, while NGOs, volunteers, and individuals in need can discover and collect it before it goes to waste.

The system also supports tagging of non-edible food waste for composting, promoting sustainability and a circular food economy.

---

## 🎯 Objectives

- Reduce edible food wastage through hyperlocal redistribution  
- Connect food donors and receivers using location-based technology  
- Support NGOs and volunteers with real-time food availability  
- Enable sustainable handling of organic waste via composting  
- Build a trust-driven community using verification and feedback  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- HTML, CSS, JavaScript
- Map-based UI (Mapbox – planned)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- RESTful APIs

### Other Tools & Services
- Cloudinary (image storage)
- JWT Authentication (planned)
- Firebase Cloud Messaging (planned)
- Git & GitHub

---

## 🧱 Project Architecture

The project follows a clean **MVC (Model–View–Controller)** architecture inspired by industry-standard MERN applications.

```
food-surplus/
├── Backend/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # REST API routes
│   ├── middleware/      # Auth & validation middleware
│   ├── utils/           # Utility & error handling
│   ├── cloudinary/      # Cloudinary configuration
│   ├── seeds/           # Sample seed data
│   ├── config/          # Configuration files
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   └── .env             # Environment variables (ignored)
└── Frontend/
    └── ...              # Frontend source (React/Vite)
```

---

## 👥 User Roles

- **Donor** – Posts surplus food listings  
- **Receiver** – Requests and collects available food  
- **Admin** – Moderates users and listings  

---

## 🌍 Key Features (Planned & Implemented)

- User registration and authentication  
- Surplus food listing with images and pickup details  
- Hyperlocal discovery using geolocation  
- Edible vs compost tagging  
- Request and approval workflow  
- Feedback and rating system  
- Secure image uploads using Cloudinary  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/hyperlocal-food-surplus-platform.git
   cd hyperlocal-food-surplus-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the Server**
   ```bash
   node server.js
   ```

   The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### API Endpoints

The API will be available at the base URL (e.g., `http://localhost:3000/api`). Check the routes directory for available endpoints.

---

## 📚 Academic Context

- **Degree:** B.E. Computer Engineering
- **University:** Savitribai Phule Pune University (SPPU)
- **Project Type:** Final Year Project (2025–26)
- **Guide:** Prof. Manisha P. Navale

This project is independently designed and developed as part of academic coursework, following proper software engineering principles.

---

## 🔮 Future Enhancements

- Mobile application (React Native)
- AI-based food freshness detection
- Advanced analytics for NGOs
- Blockchain-based donation tracking
- Real-time notifications using Firebase Cloud Messaging
- Integration with Mapbox for enhanced location services

---

## 📦 Dependencies

### Core Dependencies
- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cloudinary** - Image storage and management
- **multer** - File upload handling
- **dotenv** - Environment variable management

---

## 🤝 Contributing

This is an academic project. Contributions, suggestions, and improvements are welcome through issues or pull requests.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 🧑‍💻 Author

Developed by **[Nikunj Mehta](https://github.com/Nikunj-Mehta)** 🚀

---

## 📞 Contact

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub or contact the author.

---

**Note:** This project is currently in development. Some features may be incomplete or subject to change.
