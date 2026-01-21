import { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
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
      await register(formData);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
          Create Account
        </h2>

        <TextField
          label="Name"
          name="name"
          fullWidth
          required
          value={formData.name}
          onChange={handleChange}
        />

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

        <TextField
          select
          label="Role"
          name="role"
          fullWidth
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="donor">Donor</MenuItem>
          <MenuItem value="receiver">Receiver</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          className="!bg-green-600 hover:!bg-green-700"
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
