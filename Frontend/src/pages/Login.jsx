import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  InputAdornment,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getApiErrorMessage from "../api/getApiErrorMessage";

const Login = () => {
  const { login } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(getApiErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 76px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        <Card
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha(
              theme.palette.primary.main,
              0.15
            )}`,
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1,
                  fontWeight: 900,
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                  letterSpacing: 0,
                }}
              >
                Welcome back
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Sign in to continue to HFSE
              </Typography>
            </Box>

            {error && (
              <Box
                sx={{
                  mb: 3,
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

            <Stack spacing={3}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon
                          sx={{
                            color: "text.secondary",
                            fontSize: 20,
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
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{
                            color: "text.secondary",
                            fontSize: 20,
                            mr: 1,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.9rem",
                }}
              >
                Don't have an account?{" "}
                <Typography
                  component={Link}
                  to="/register"
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
                  Sign up
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
