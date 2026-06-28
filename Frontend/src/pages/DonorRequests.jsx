import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { CheckCircleOutline, CloseOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/time";
import { calculateDistance } from "../utils/distance";

const statusColor = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/requests/received");
        setRequests(res.data.data);
      } catch {
        alert("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const refresh = async () => {
    const res = await api.get("/requests/received");
    setRequests(res.data.data);
  };

  const handleApprove = async (id) => {
    await api.put(`/requests/${id}/approve`);
    refresh();
  };

  const handleReject = async (id) => {
    await api.put(`/requests/${id}/reject`);
    refresh();
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ py: 5, minHeight: "calc(100vh - 72px)" }}>
      <Container maxWidth="lg">
        <Typography variant="h1" sx={{ mb: 1 }}>
          Requests on my food
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Review receiver requests and coordinate approved pickups.
        </Typography>

        {requests.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", bgcolor: "surface.container" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              No requests yet
            </Typography>
            <Typography color="text.secondary">
              Receiver requests for your listings will appear here.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={3}>
            {requests.map((item) => (
              <Card key={item.food._id}>
                <CardContent>
                  <Stack spacing={2.5}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "stretch", sm: "center" }}
                      onClick={() => navigate(`/foods/${item.food._id}`)}
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                        transformOrigin: "center",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      {item.food.images?.length > 0 && (
                        <Box
                          component="img"
                          src={item.food.images[0].url}
                          alt={item.food.title}
                          sx={{
                            width: { xs: "100%", sm: 112 },
                            height: 112,
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" sx={{ fontSize: 22 }}>
                          {item.food.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available: {item.food.quantity} {item.food.quantityUnit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Added {timeAgo(item.food.createdAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.food.status}
                        color={statusColor[item.food.status] || "default"}
                      />
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {item.requests.map((req) => {
                        const foodCoords = item.food?.location?.coordinates;
                        const reqCoords = req.requesterLocation?.coordinates;
                        const distanceKm =
                          foodCoords?.length === 2 && reqCoords?.length === 2
                            ? calculateDistance(
                                foodCoords[1],
                                foodCoords[0],
                                reqCoords[1],
                                reqCoords[0]
                              ).toFixed(2)
                            : null;

                        return (
                          <Box
                            key={req._id}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "surface.containerLow",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography fontWeight={700}>
                                    {req.requester.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {req.requester.email}
                                  </Typography>
                                </Box>
                                <Chip
                                  size="small"
                                  label={req.status}
                                  color={statusColor[req.status] || "default"}
                                />
                              </Stack>

                              <Typography variant="body2" color="text.secondary">
                                Requested Qty: {req.requestedQuantity}
                              </Typography>
                              {distanceKm && (
                                <Typography variant="body2" color="text.secondary">
                                  Distance: {distanceKm} km away
                                </Typography>
                              )}

                              {req.reviewed && req.review?.rating && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    Receiver rating:
                                  </Typography>
                                  <Rating value={req.review.rating} readOnly size="small" />
                                  <Typography variant="caption" color="text.secondary">
                                    {req.review.rating}/5
                                  </Typography>
                                </Stack>
                              )}

                              {req.status === "approved" && req.requester.phone && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ color: "success.dark" }}
                                >
                                  <LocalPhoneOutlined fontSize="small" />
                                  <Typography variant="body2">
                                    Contact {req.requester.name}: {req.requester.phone}
                                  </Typography>
                                </Stack>
                              )}

                              {req.status === "pending" && (
                                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                                  <Button
                                    variant="contained"
                                    startIcon={<CheckCircleOutline />}
                                    onClick={() => handleApprove(req._id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CloseOutlined />}
                                    onClick={() => handleReject(req._id)}
                                  >
                                    Reject
                                  </Button>
                                </Stack>
                              )}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default DonorRequests;
