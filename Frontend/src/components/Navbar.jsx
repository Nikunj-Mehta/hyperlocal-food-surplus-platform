import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { getDonorNotificationCount, getReceiverNotificationCount } from "../api/notifications";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
  
      try {
        if (user.role === "donor") {
          const count = await getDonorNotificationCount();
          setNotifCount(count);
        } else {
          const count = await getReceiverNotificationCount();
          setNotifCount(count);
        }
      } catch (err) {
        console.error("Notification fetch failed");
      }
    };
  
    fetchNotifications();
  }, [user]);  

  const handleRoleSwitch = async () => {
    try {
      const newRole = user.role === "donor" ? "receiver" : "donor";
      const res = await api.patch("/users/change-role", { role: newRole });
      setUser((prev) => ({ ...prev, role: res.data.role }));
      // Redirect to home after role switch
      navigate("/");
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

            {user?.role === "receiver" && (
              <Link to="/requests/my" className="relative" onClick={() => setNotifCount(0)}>
              <Button variant="outlined">My Requests</Button>
            
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </Link>            
            )}

            {user?.role === "donor" && (
              <Button
                variant="contained"
                className="!bg-green-600 hover:!bg-green-700"
                onClick={() => navigate("/foods/new")}
              >
                Add Food
              </Button>
            )}

            {user?.role === "donor" && (
              <Button
                variant="outlined"
                onClick={() => navigate("/foods/my")}
              >
                My Foods
              </Button>
            )}

            {user?.role === "donor" && (
              <Link to="/dashboard/requests" className="relative" onClick={() => setNotifCount(0)}>
              <Button variant="outlined">Requests</Button>
            
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </Link>
            )}

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
