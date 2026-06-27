import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AlternateEmail,
  BadgeOutlined,
  LockOutlined,
  PersonOutline,
  PhoneOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getApiErrorMessage from "../api/getApiErrorMessage";

const Register = () => {
  const { register } = useAuth();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "donor",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
    } catch (error) {
      setError(getApiErrorMessage(error, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        py: 5,
        minHeight: "calc(100vh - 76px)",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha(
              theme.palette.primary.main,
              0.15
            )}`,
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Stack
              spacing={3}
              component="form"
              onSubmit={handleSubmit}
            >
              <Box sx={{ textAlign: "center", mb: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", sm: "2.25rem" },
                    letterSpacing: 0,
                  }}
                >
                  Create account
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  Join as a donor or receiver and start sharing
                  locally.
                </Typography>
              </Box>

              {error && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(
                      theme.palette.error.main,
                      0.1
                    ),
                    border: `1px solid ${alpha(
                      theme.palette.error.main,
                      0.3
                    )}`,
                  }}
                >
                  <Typography
                    color="error"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}

              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline
                          sx={{
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail
                          sx={{
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Phone number"
                name="phone"
                type="tel"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined
                          sx={{
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined
                          sx={{
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword(
                              (value) => !value
                            )
                          }
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                select
                label="Role"
                name="role"
                fullWidth
                value={formData.role}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlined
                          sx={{
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="donor">Donor</MenuItem>
                <MenuItem value="receiver">Receiver</MenuItem>
                <MenuItem value="compost_receiver">Compost Receiver</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  mt: 1,
                }}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  Already have an account?{" "}
                  <Typography
                    component={Link}
                    to="/login"
                    variant="button"
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      textDecoration: "none",
                      transition:
                        "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Sign in
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
