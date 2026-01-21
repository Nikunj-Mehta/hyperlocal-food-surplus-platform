import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async () => {
    try {
      const newRole = user.role === "donor" ? "receiver" : "donor";
      const res = await api.patch("/users/change-role", { role: newRole });
      setUser((prev) => ({ ...prev, role: res.data.role }));
    } catch (error) {
      alert("Failed to switch role");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-green-600 font-bold text-xl">
        Food Surplus
      </Link>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login">
              <Button variant="outlined">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="contained" className="!bg-green-600">
                Register
              </Button>
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-600">
              {user.role.toUpperCase()}
            </span>

            <Button
              variant="outlined"
              onClick={handleRoleSwitch}
            >
              Switch Role
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
