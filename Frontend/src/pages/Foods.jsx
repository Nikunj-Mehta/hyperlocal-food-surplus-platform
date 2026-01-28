import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "@mui/material";
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
        const res = await api.get("/foods");
        setFoods(res.data.data);
      } catch (error) {
        alert("Failed to load food listings");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return <div className="p-6">Loading food listings...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Available Food Listings
      </h1>

      {foods.length === 0 ? (
        <p className="text-center text-gray-500">
          No food available right now
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3"
            >
              {food.images?.length > 0 && (
                <img
                  src={food.images[0].url}
                  alt={food.title}
                  className="h-40 w-full object-cover rounded cursor-pointer"
                  onClick={() => navigate(`/foods/${food._id}`)}
                />
              )}

              <h2
                className="text-lg font-semibold cursor-pointer hover:underline"
                onClick={() => navigate(`/foods/${food._id}`)}
              >
                {food.title}
              </h2>

              <p className="text-sm text-gray-600">
                Quantity: {food.quantity} {food.quantityUnit}
              </p>

              <p className="text-sm text-gray-600">
                Type: <span className="capitalize">{food.foodType}</span>
              </p>

              <p className="text-sm text-gray-500">{food.address}</p>

              <p className="text-xs text-gray-500 mt-1"> Added {timeAgo(food.createdAt)} </p>

              {food.author?.rating?.count > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  ⭐ {food.author.rating.average} · {food.author.rating.count} reviews
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Foods;