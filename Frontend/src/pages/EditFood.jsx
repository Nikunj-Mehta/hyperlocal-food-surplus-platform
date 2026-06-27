import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import api from "../api/axios";
import FoodForm from "../components/FoodForm";

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);

  useEffect(() => {
    const fetchFood = async () => {
      const res = await api.get(`/foods/${id}`);
      setFood(res.data.data);
    };
    fetchFood();
  }, [id]);

  const handleUpdate = async (formData) => {
    await api.put(`/foods/${id}`, formData);
    navigate(`/foods/${id}`);
  };

  if (!food) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ py: 5, minHeight: "calc(100vh - 72px)" }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  Edit food listing
                </Typography>
                <Typography color="text.secondary">
                  Update availability, pickup details, and photos.
                </Typography>
              </Box>
              <FoodForm mode="edit" initialData={food} onSubmit={handleUpdate} />
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditFood;
