import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AddCircleOutline,
  DashboardOutlined,
  Logout,
  NotificationsNone,
  Restaurant,
  SwapHoriz,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  getDonorNotificationCount,
  getReceiverNotificationCount,
} from "../api/notifications";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const count =
          user.role === "donor"
            ? await getDonorNotificationCount()
            : await getReceiverNotificationCount();
        setNotifCount(count);
      } catch {
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
      navigate("/");
    } catch {
      alert("Failed to switch role");
    }
  };

  const notificationPath =
    user?.role === "donor" ? "/dashboard/requests" : "/requests/my";

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 76,
            gap: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
              mr: "auto",
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                color: "primary.contrastText",
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontSize: 24,
              }}
            >
              <Restaurant />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="strong"
                variant="h4"
                sx={{
                  fontSize: { xs: 28, sm: 34 },
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: 0,
                  display: "block",
                }}
              >
                HFSE
              </Typography>
              {!compact && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem", fontWeight: 700 }}
                >
                  A Hyperlocal Community Food Surplus Exchange Platform
                </Typography>
              )}
            </Box>
          </Box>

          {!user ? (
            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  fontWeight: 600,
                }}
              >
                Register
              </Button>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {!compact && (
                <Chip
                  label={user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  color={user.role === "donor" ? "primary" : "secondary"}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                />
              )}

              {user.role !== "compost_receiver" && (
                <Tooltip title="Switch role" arrow>
                  <Button
                    variant="outlined"
                    startIcon={<SwapHoriz fontSize="small" />}
                    onClick={handleRoleSwitch}
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", sm: "0.95rem" },
                    }}
                  >
                    {!compact && "Switch"}
                  </Button>
                </Tooltip>
              )}

              {user.role === "donor" && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutline fontSize="small" />}
                    onClick={() => navigate("/foods/new")}
                    sx={{
                      bgcolor: '#2e7d32', 
                      color: 'white', 
                      '&:hover': { bgcolor: '#1b5e20' },
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", sm: "0.95rem" },
                    }}
                  >
                    {!compact && "Add Food"}
                  </Button>
                  {!compact && (
                    <Button
                      variant="outlined"
                      startIcon={<DashboardOutlined fontSize="small" />}
                      onClick={() => navigate("/foods/my")}
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      My Listings
                    </Button>
                  )}
                </>
              )}

              <Tooltip
                title={
                  user.role === "donor" ? "Food requests" : "My requests"
                }
                arrow
              >
                <IconButton
                  component={Link}
                  to={notificationPath}
                  onClick={() => setNotifCount(0)}
                  color="primary"
                  sx={{
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Badge badgeContent={notifCount} color="error">
                    <NotificationsNone />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout" arrow>
                <IconButton
                  color="error"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  sx={{
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Logout />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
