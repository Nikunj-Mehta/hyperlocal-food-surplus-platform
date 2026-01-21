import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-green-600">
          Login
        </h2>

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          className="!bg-green-600 hover:!bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;