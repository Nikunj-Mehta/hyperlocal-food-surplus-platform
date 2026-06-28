import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DeleteOutline, EditOutlined, Inventory2Outlined } from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/time";

const statusColor = {
  available: "success",
  requested: "warning",
  completed: "default",
};

const MyFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyFoods = async () => {
      try {
        const res = await api.get("/foods/my");
        setFoods(res.data.data);
      } catch {
        alert("Failed to load your foods");
      } finally {
        setLoading(false);
      }
    };

    fetchMyFoods();
  }, []);

  const handleDelete = async (foodId) => {
    if (!window.confirm("Delete this food listing?")) return;

    try {
      await api.delete(`/foods/${foodId}`);
      setFoods((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      alert(err.response?.data?.error || "Delete not allowed");
    }
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
          My Listings
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Manage what you have shared with nearby receivers.
        </Typography>

        {foods.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", bgcolor: "surface.container" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              No food listings yet
            </Typography>
            <Typography color="text.secondary">
              Add your first listing when surplus food is ready to share.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {foods.map((food) => (
              <Grid key={food._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card sx={{ height: "100%", overflow: "hidden" }}>
                  <CardActionArea onClick={() => navigate(`/foods/${food._id}`)}>
                    {food.images?.length > 0 ? (
                      <CardMedia
                        component="img"
                        src={food.images[0].url}
                        alt={food.title}
                        sx={{ height: 168, objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 168,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "surface.containerHigh",
                        }}
                      >
                        <Inventory2Outlined color="primary" />
                      </Box>
                    )}
                  </CardActionArea>

                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Typography variant="h3" sx={{ fontSize: 20 }}>
                          {food.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={food.status}
                          color={statusColor[food.status] || "default"}
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        Quantity: {food.quantity} {food.quantityUnit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Added {timeAgo(food.createdAt)}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                        {food.status !== "fulfilled" && (
                          <Button
                            variant="outlined"
                            startIcon={<EditOutlined />}
                            onClick={() => navigate(`/foods/${food._id}/edit`)}
                          >
                            Edit
                          </Button>
                        )}
                        {food.status === "available" && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutline />}
                            onClick={() => handleDelete(food._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyFoods;
