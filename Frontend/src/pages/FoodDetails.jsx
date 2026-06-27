import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircleOutline,
  CloseOutlined,
  EditOutlined,
  Inventory2Outlined,
  LocationOnOutlined,
  MyLocation,
  SendOutlined,
  Star,
} from "@mui/icons-material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatDate, timeAgo } from "../utils/time";
import MapView from "../components/MapView";
import { calculateDistance } from "../utils/distance";

const statusColor = {
  available: "success",
  requested: "warning",
  completed: "default",
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestQty, setRequestQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [requests, setRequests] = useState([]);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    if (user?.role === "receiver" || user?.role === "compost_receiver") {
      api.get("/requests/my").then((res) => {
        const alreadyRequested = res.data.data.some((req) => req.food._id === id);
        setHasRequested(alreadyRequested);
      });
    }
  }, [id, user]);

  useEffect(() => {
    if (user?.role === "donor") {
      api
        .get(`/foods/${id}/requests`)
        .then((res) => setRequests(res.data.requests))
        .catch(() => { });
    }
  }, [id, user]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/foods/${id}`);
        setFood(res.data.data);
      } catch {
        alert("Food not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, navigate]);

  const refreshRequests = async () => {
    const res = await api.get(`/foods/${id}/requests`);
    setRequests(res.data.requests);
  };

  const handleApprove = async (requestId) => {
    await api.put(`/requests/${requestId}/approve`);
    refreshRequests();
  };

  const handleReject = async (requestId) => {
    await api.put(`/requests/${requestId}/reject`);
    refreshRequests();
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toFixed(6));
        setLng(coords.longitude.toFixed(6));
        setLocationMessage("Location captured successfully.");
        setLocating(false);
      },
      (error) => {
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Please allow location access and try again."
            : "Could not fetch your location. Please try again."
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const closeRequestModal = () => {
    setOpenRequestModal(false);
    setLocationMessage("");
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!food) return null;

  const isOwner = user && food.author?._id === user._id;
  const foodCoords = food.location?.coordinates;
  const hasFoodCoords = foodCoords?.length === 2;
  const distanceKm =
    lat && lng && hasFoodCoords
      ? calculateDistance(
        Number(lat),
        Number(lng),
        foodCoords[1],
        foodCoords[0]
      )
      : null;

  return (
    <Box component="main" sx={{ py: 5, minHeight: "calc(100vh - 72px)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Card sx={{ overflow: "hidden" }}>
                {food.images?.length > 0 && (
                  <Box
                    component="img"
                    src={food.images[0].url}
                    alt={food.title}
                    sx={{ width: "100%", height: { xs: 260, md: 420 }, objectFit: "cover" }}
                  />
                )}
                {food.images?.length > 1 && (
                  <Stack direction="row" spacing={1} sx={{ p: 1.5, overflowX: "auto" }}>
                    {food.images.slice(1).map((img) => (
                      <Box
                        key={img.filename}
                        component="img"
                        src={img.url}
                        alt={food.title}
                        sx={{
                          width: 88,
                          height: 88,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    Pickup location
                  </Typography>
                  <MapView lat={foodCoords?.[1]} lng={foodCoords?.[0]} label={food.title} />
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ position: { md: "sticky" }, top: 96 }}>
              <CardContent>
                <Stack spacing={2.25}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Chip
                      label={food.status}
                      color={statusColor[food.status] || "default"}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo(food.createdAt)}
                    </Typography>
                  </Stack>

                  <Box>
                    <Typography variant="h1" sx={{ mb: 1 }}>
                      {food.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Added on {formatDate(food.createdAt)}
                    </Typography>
                  </Box>

                  <Divider />

                  {food.description && (
                    <Box>
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {food.description}
                      </Typography>
                    </Box>
                  )}

                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Inventory2Outlined color="primary" />
                      <Typography>
                        {food.quantity} {food.quantityUnit} · {food.foodType}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <LocationOnOutlined color="primary" />
                      <Typography>{food.address}</Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "surface.containerLow" }}>
                    <Typography variant="body2" color="text.secondary">
                      Donor
                    </Typography>
                    <Typography fontWeight={700}>{food.author?.name}</Typography>
                    {food.author?.rating?.count > 0 && (
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                        <Star sx={{ fontSize: 18, color: "warning.main" }} />
                        <Typography variant="body2" color="text.secondary">
                          {food.author.rating.average} ({food.author.rating.count} reviews)
                        </Typography>
                      </Stack>
                    )}
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    {(user?.role === "receiver" || user?.role === "compost_receiver") &&
                      food.status === "available" &&
                      !isOwner && (
                        <Button
                          variant="contained"
                          startIcon={<SendOutlined />}
                          disabled={hasRequested}
                          onClick={() => {
                            if (!hasRequested) setOpenRequestModal(true);
                          }}
                        >
                          {hasRequested ? "Request Sent" : (food.foodType === "compost" ? "Request Compost" : "Request Food")}
                        </Button>
                      )}

                    {isOwner && food.status !== "fulfilled" && (
                      <Button
                        variant="outlined"
                        startIcon={<EditOutlined />}
                        onClick={() => navigate(`/foods/${food._id}/edit`)}
                      >
                        Edit Listing
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {user?.role === "donor" && requests.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Requests on this food
            </Typography>
            <Stack spacing={2}>
              {requests.map((req) => {
                const reqCoords = req.requesterLocation?.coordinates;
                const requestDistanceKm =
                  foodCoords?.length === 2 && reqCoords?.length === 2
                    ? calculateDistance(
                      foodCoords[1],
                      foodCoords[0],
                      reqCoords[1],
                      reqCoords[0]
                    ).toFixed(2)
                    : null;

                return (
                  <Card key={req._id}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          <Box>
                            <Typography fontWeight={700}>
                              {req.requester?.name || "Receiver"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {req.requester?.email || "Contact details unavailable"}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={req.status}
                            color={statusColor[req.status] || "default"}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Requested Quantity: {req.requestedQuantity}
                        </Typography>
                        {requestDistanceKm && (
                          <Typography variant="body2" color="text.secondary">
                            Distance: {requestDistanceKm} km away
                          </Typography>
                        )}
                        {req.status === "pending" && (
                          <Stack direction="row" spacing={1}>
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
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        )}
      </Container>

      <Dialog
        open={openRequestModal}
        onClose={closeRequestModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 900, letterSpacing: 0 }}>
          Request {food.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Available: {food.quantity} {food.quantityUnit}
            </Typography>
            <TextField
              label="Quantity"
              type="number"
              inputProps={{ min: 1, max: food.quantity }}
              value={requestQty}
              onChange={(e) => setRequestQty(e.target.value)}
              fullWidth
            />
            <Button
              variant={lat && lng ? "outlined" : "contained"}
              startIcon={<MyLocation />}
              onClick={handleFetchLocation}
              disabled={locating}
              fullWidth
            >
              {locating
                ? "Fetching location..."
                : lat && lng
                  ? "Refresh My Location"
                  : "Fetch My Location"}
            </Button>
            {locationMessage && (
              <Alert
                severity={
                  locationMessage.startsWith("Location captured")
                    ? "success"
                    : "warning"
                }
              >
                {locationMessage}
              </Alert>
            )}
            {distanceKm !== null && (
              <Typography variant="body2" color="text.secondary">
                This {food.foodType === "compost" ? "compost" : "food"} is approximately {distanceKm.toFixed(2)} km away from you.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeRequestModal}>Cancel</Button>
          <Button
            variant="contained"
            disabled={submitting || locating || !lat || !lng}
            onClick={async () => {
              try {
                setSubmitting(true);
                if (!lat || !lng) {
                  setLocationMessage("Please fetch your location before sending the request.");
                  setSubmitting(false);
                  return;
                }
                await api.post(`/foods/${food._id}/request`, {
                  quantity: requestQty,
                  location: {
                    coordinates: [Number(lng), Number(lat)],
                  },
                });
                setHasRequested(true);
                alert("Request sent successfully");
                closeRequestModal();
              } catch (err) {
                alert(err.response?.data?.error || "Failed to send request");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodDetails;
