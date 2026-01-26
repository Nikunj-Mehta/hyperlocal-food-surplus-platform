import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/time";

const MyFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyFoods = async () => {
      try {
        const res = await api.get("/foods/my");
        setFoods(res.data.data);
      } catch (err) {
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Food Listings</h1>

      {foods.length === 0 ? (
        <p className="text-gray-500">No food listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div
            key={food._id}
            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3"
          >
            {/* Image */}
            {food.images?.length > 0 && (
              <img
                src={food.images[0].url}
                alt={food.title}
                className="h-32 w-full object-cover rounded cursor-pointer"
                onClick={() => navigate(`/foods/${food._id}`)}
              />
            )}
          
            {/* Title */}
            <h2
              className="font-semibold text-lg cursor-pointer hover:underline"
              onClick={() => navigate(`/foods/${food._id}`)}
            >
              {food.title}
            </h2>
          
            {/* Quantity */}
            <p className="text-sm text-gray-600">
              Quantity: {food.quantity} {food.quantityUnit}
            </p>
          
            {/* Status badge */}
            <span
              className={`inline-block w-fit px-2 py-1 text-xs rounded ${
                food.status === "available"
                  ? "bg-green-100 text-green-700"
                  : food.status === "requested"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {food.status.toUpperCase()}
            </span>

            <p className="text-xs text-gray-500"> Added {timeAgo(food.createdAt)} </p>
          
            {/* Actions */}
            <div className="flex gap-4 mt-2">
              {/* Edit button */}
              <button
                onClick={() => navigate(`/foods/${food._id}/edit`)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
          
              {/* Delete button only if available */}
              {food.status === "available" && (
                <button
                  onClick={() => handleDelete(food._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>          
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFoods;