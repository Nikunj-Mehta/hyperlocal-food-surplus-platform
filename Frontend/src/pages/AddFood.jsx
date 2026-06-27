import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddPhotoAlternateOutlined,
  GpsFixed,
  Close,
  LocationOnOutlined,
  RestaurantMenu,
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddFood = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    quantityUnit: "plates",
    foodType: "edible",
    address: "",
    latitude: "",
    longitude: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleUseCurrentLocation = () => {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        }));
        setLocationMessage("Location captured.");
        setLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Please allow location access or enter coordinates manually."
            : "Could not get your location. Please try again or enter coordinates manually.";
        setLocationMessage(message);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("quantityUnit", formData.quantityUnit);
      formDataToSend.append("foodType", formData.foodType);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("location[coordinates][0]", formData.longitude);
      formDataToSend.append("location[coordinates][1]", formData.latitude);

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await api.post("/foods", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Food listing added successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add food");
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box component="main" sx={{ py: 5, minHeight: "calc(100vh - 72px)" }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <RestaurantMenu color="primary" />
                  <Typography variant="h2">Add food listing</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Share the pickup details receivers need to request it.
                </Typography>
              </Box>

              <TextField
                label="Food title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
              />

              <TextField
                label="Details"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Add any extra notes or details about the listing..."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  fullWidth
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Quantity unit"
                  name="quantityUnit"
                  fullWidth
                  value={formData.quantityUnit}
                  onChange={handleChange}
                >
                  <MenuItem value="plates">Plates</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="packets">Packets</MenuItem>
                </TextField>
              </Stack>

              <TextField
                select
                label="Food type"
                name="foodType"
                fullWidth
                value={formData.foodType}
                onChange={handleChange}
              >
                <MenuItem value="edible">Edible</MenuItem>
                <MenuItem value="compost">Compost</MenuItem>
              </TextField>

              <TextField
                label="Pickup address"
                name="address"
                fullWidth
                required
                value={formData.address}
                onChange={handleChange}
              />

              <Stack spacing={1}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<GpsFixed />}
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {locating ? "Getting location..." : "Use Current Location"}
                </Button>

                {locationMessage && (
                  <Alert severity={locationMessage.startsWith("Location captured") ? "success" : "warning"}>
                    {locationMessage}
                  </Alert>
                )}
              </Stack>

              {formData.latitude && formData.longitude && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "surface.containerLow",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlined color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Coordinates captured: {formData.latitude}, {formData.longitude}
                    </Typography>
                  </Stack>
                </Box>
              )}

              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateOutlined />}
                  sx={{ mb: imagePreviews.length ? 2 : 0 }}
                >
                  Upload Images
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>

                {imagePreviews.length > 0 && (
                  <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 1 }}>
                    {imagePreviews.map((src, index) => (
                      <Box
                        key={src}
                        sx={{
                          position: "relative",
                          flex: "0 0 auto",
                          width: 72,
                          height: 72,
                        }}
                      >
                        <Box
                          component="img"
                          src={src}
                          alt="preview"
                          sx={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                        <Tooltip title="Remove image">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: "absolute",
                              top: -10,
                              right: -10,
                              bgcolor: "background.paper",
                              boxShadow: 1,
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting || locating || !formData.latitude || !formData.longitude}
              >
                {submitting ? "Publishing..." : "Publish Listing"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AddFood;
