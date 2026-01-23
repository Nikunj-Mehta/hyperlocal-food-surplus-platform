import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  if (!food) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Food</h1>
      <FoodForm
        mode="edit"
        initialData={food}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditFood;