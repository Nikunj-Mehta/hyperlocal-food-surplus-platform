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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  AddCircleOutline,
  Inventory2Outlined,
  LocationOnOutlined,
  Star,
} from "@mui/icons-material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/time";

const Foods = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const typeParam = user?.role === "compost_receiver" ? "?type=compost" : "?type=edible";
        const res = await api.get(`/foods${typeParam}`);
        setFoods(res.data.data);
      } catch {
        alert("Failed to load food listings");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 72px)", py: 5 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h1" sx={{ mb: 1 }}>
              {user?.role === "compost_receiver" ? "Available compost nearby" : "Available food nearby"}
            </Typography>
            <Typography color="text.secondary">
              {user?.role === "compost_receiver" 
                ? "Browse fresh compost listings from donors in your area." 
                : "Browse fresh surplus listings from donors in your area."}
            </Typography>
          </Box>


        </Stack>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card>
                  <Skeleton variant="rectangular" height={188} />
                  <CardContent>
                    <Skeleton width="70%" />
                    <Skeleton width="45%" />
                    <Skeleton width="85%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : foods.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", bgcolor: "surface.container" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {user?.role === "compost_receiver" ? "No compost available right now" : "No food available right now"}
            </Typography>
            <Typography color="text.secondary">
              Check back soon for new donor listings.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {foods.map((food) => (
              <Grid key={food._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card sx={{ height: "100%", overflow: "hidden" }}>
                  <CardActionArea
                    onClick={() => navigate(`/foods/${food._id}`)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    {food.images?.length > 0 ? (
                      <CardMedia
                        component="img"
                        image={food.images[0].url}
                        alt={food.title}
                        sx={{ height: 188, objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 188,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "surface.containerHigh",
                          color: "text.secondary",
                        }}
                      >
                        <Inventory2Outlined fontSize="large" />
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                      <Stack spacing={1.25}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography variant="h3" sx={{ fontSize: 20 }}>
                            {food.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={food.foodType}
                            color={
                              food.foodType === "edible"
                                ? "primary"
                                : "secondary"
                            }
                            variant="outlined"
                          />
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Inventory2Outlined
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {food.quantity} {food.quantityUnit}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnOutlined
                            sx={{ fontSize: 18, color: "tertiary.main" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {food.address}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ pt: 0.5 }}
                        >
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTime
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {timeAgo(food.createdAt)}
                            </Typography>
                          </Stack>

                          {food.author?.rating?.count > 0 && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Star sx={{ fontSize: 16, color: "warning.main" }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {food.author.rating.average} ·{" "}
                                {food.author.rating.count}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Foods;
