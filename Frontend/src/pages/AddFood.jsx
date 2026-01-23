import { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddFood = () => {
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);    
  
    const [formData, setFormData] = useState({
    title: "",
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
  
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
  
      formDataToSend.append("title", formData.title);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("quantityUnit", formData.quantityUnit);
      formDataToSend.append("foodType", formData.foodType);
      formDataToSend.append("address", formData.address);
  
      // Location (backend expects coordinates array)
      formDataToSend.append(
        "location[coordinates][0]",
        formData.longitude
      );
      formDataToSend.append(
        "location[coordinates][1]",
        formData.latitude
      );

      // Images
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
    }
  };  

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };  

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Add Food Listing
        </h2>

        <TextField
          label="Food Title"
          name="title"
          fullWidth
          required
          value={formData.title}
          onChange={handleChange}
        />

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
          label="Quantity Unit"
          name="quantityUnit"
          fullWidth
          value={formData.quantityUnit}
          onChange={handleChange}
        >
          <MenuItem value="plates">Plates</MenuItem>
          <MenuItem value="kg">Kg</MenuItem>
          <MenuItem value="packets">Packets</MenuItem>
        </TextField>

        <TextField
          select
          label="Food Type"
          name="foodType"
          fullWidth
          value={formData.foodType}
          onChange={handleChange}
        >
          <MenuItem value="edible">Edible</MenuItem>
          <MenuItem value="compost">Compost</MenuItem>
        </TextField>

        <TextField
          label="Address"
          name="address"
          fullWidth
          required
          value={formData.address}
          onChange={handleChange}
        />

        <div className="flex gap-4">
          <TextField
            label="Latitude"
            name="latitude"
            fullWidth
            required
            value={formData.latitude}
            onChange={handleChange}
          />
          <TextField
            label="Longitude"
            name="longitude"
            fullWidth
            required
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Images
            </label>

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600"
            />
        </div>

        {imagePreviews.length > 0 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {imagePreviews.map((src, index) => (
            <div
                key={index}
                className="relative flex-shrink-0 h-14 w-14"
            >
                <img
                src={src}
                alt="preview"
                className="h-14 w-14 object-cover rounded border"
                />

                {/* Remove button */}
                <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 z-20
                            -translate-y-1/2 translate-x-1/2
                            bg-red-500 text-white rounded-full
                            w-5 h-5 flex items-center justify-center
                            text-xs hover:bg-red-600 shadow"
                >
                ✕
                </button>
            </div>
            ))}
        </div>
        )}

        <Button
          type="submit"
          variant="contained"
          className="!bg-green-600 hover:!bg-green-700 w-full"
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default AddFood;