import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { LocalPhoneOutlined, LocationOnOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { calculateDistance } from "../utils/distance";
import ReviewStars from "../components/ReviewStars";

const statusColor = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(res.data.data);
      } catch {
        alert("Failed to load your requests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  const submitReview = async (requestId, rating) => {
    try {
      await api.post("/reviews", { requestId, rating });
      const res = await api.get("/requests/my");
      setRequests(res.data.data);
      alert("Review submitted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading your requests...</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ py: 5, minHeight: "calc(100vh - 72px)" }}>
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1 }}>
          My requests
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Track pickup approvals and review completed donations.
        </Typography>

        {requests.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", bgcolor: "surface.container" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              You have not made any requests yet
            </Typography>
            <Typography color="text.secondary">
              Food you request will show up here.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2.5}>
            {requests.map((req) => {
              let distanceKm = null;

              if (
                req.requesterLocation?.coordinates?.length === 2 &&
                req.food?.location?.coordinates?.length === 2
              ) {
                distanceKm = calculateDistance(
                  req.requesterLocation.coordinates[1],
                  req.requesterLocation.coordinates[0],
                  req.food.location.coordinates[1],
                  req.food.location.coordinates[0]
                );
              }

              return (
                <Card key={req._id}>
                  <CardContent>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                      {req.food?.images?.length > 0 && (
                        <Box
                          component="img"
                          src={req.food.images[0].url}
                          alt={req.food.title}
                          onClick={() => navigate(`/foods/${req.food._id}`)}
                          sx={{
                            width: { xs: "100%", sm: 132 },
                            height: 132,
                            objectFit: "cover",
                            borderRadius: 2,
                            cursor: "pointer",
                            transition:
                              "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                            transformOrigin: "center",
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                          }}
                        />
                      )}

                      <Stack spacing={1.25} sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="h3"
                            sx={{
                              fontSize: 22,
                              cursor: "pointer",
                              transition:
                                "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                              transformOrigin: "left center",
                              "&:hover": {
                                transform: "scale(1.02)",
                              },
                            }}
                            onClick={() => navigate(`/foods/${req.food._id}`)}
                          >
                            {req.food?.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={req.status}
                            color={statusColor[req.status] || "default"}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          Requested Quantity: {req.requestedQuantity}{" "}
                          {req.food?.quantityUnit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {req.food?.address}
                        </Typography>

                        {distanceKm && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnOutlined sx={{ fontSize: 18, color: "tertiary.main" }} />
                            <Typography variant="body2" color="text.secondary">
                              {distanceKm.toFixed(2)} km from your location
                            </Typography>
                          </Stack>
                        )}

                        {req.status === "approved" && req.reviewed === false && (
                          <>
                            <Divider sx={{ my: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              Add a review after receiving food
                            </Typography>
                            <ReviewStars onSubmit={(rating) => submitReview(req._id, rating)} />
                          </>
                        )}

                        {req.status === "approved" && req.reviewed && req.review?.rating && (
                          <>
                            <Divider sx={{ my: 0.5 }} />
                            <Typography variant="body2" fontWeight={700}>
                              Your review
                            </Typography>
                            <Rating value={req.review.rating} readOnly />
                          </>
                        )}

                        {req.status === "approved" && req.food?.author?.phone && (
                          <Stack
                            spacing={0.5}
                            sx={{
                              mt: 1,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "success.light",
                              color: "success.dark",
                            }}
                          >
                            <Typography variant="body2" fontWeight={700}>
                              Contact {req.food.author.name} to receive the food
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LocalPhoneOutlined fontSize="small" />
                              <Typography variant="body2">{req.food.author.phone}</Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default MyRequests;
