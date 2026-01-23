import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Foods from "./pages/Foods";
import FoodDetails from "./pages/FoodDetails";
import AddFood from "./pages/AddFood";
import MyFoods from "./pages/MyFoods";
import EditFood from "./pages/EditFood";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            user ? ( <Foods /> ) : ( <Navigate to="/login" /> )
          }
        />
        <Route path="/foods/:id" element={<FoodDetails />} />
        <Route
          path="/foods/new"
          element={
            user?.role === "donor" ? (
              <AddFood />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/foods/my" element={<MyFoods />} />

        <Route path="/foods/:id/edit" element={<EditFood />} />

      </Routes>
    </Router>
  );
}

export default App;
