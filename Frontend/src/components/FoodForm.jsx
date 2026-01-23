import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const FoodForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    quantity: "",
    quantityUnit: "plates",
    foodType: "edible",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Prefill for edit
  useEffect(() => {
    if (mode === "edit" && initialData?._id) {
      setFormData({
        title: initialData.title,
        quantity: initialData.quantity,
        quantityUnit: initialData.quantityUnit,
        foodType: initialData.foodType,
        address: initialData.address,
        latitude: initialData.location?.coordinates[1],
        longitude: initialData.location?.coordinates[0],
      });

      setExistingImages(initialData.images || []);
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeExistingImage = (filename) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.filename !== filename)
    );
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) =>
      fd.append(key, value)
    );

    newImages.forEach((img) => fd.append("images", img));
    existingImages.forEach((img) =>
      fd.append("existingImages", img.filename)
    );

    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Inputs – reuse from AddFood */}
      {/* (You already have these; keep same JSX) */}
      {/* Title */}
        <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Food title"
        className="w-full border rounded p-2"
        required
        />

        {/* Quantity + Unit */}
        <div className="flex gap-3">
        <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-1/2 border rounded p-2"
            required
        />

        <select
            name="quantityUnit"
            value={formData.quantityUnit}
            onChange={handleChange}
            className="w-1/2 border rounded p-2"
        >
            <option value="plates">Plates</option>
            <option value="kg">Kg</option>
            <option value="packets">Packets</option>
        </select>
        </div>

        {/* Food Type */}
        <select
        name="foodType"
        value={formData.foodType}
        onChange={handleChange}
        className="w-full border rounded p-2"
        >
        <option value="edible">Edible</option>
        <option value="compost">Compost</option>
        </select>

        {/* Address */}
        <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Pickup address"
        className="w-full border rounded p-2"
        required
        />

        {/* Latitude & Longitude */}
        <div className="flex gap-3">
        <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-1/2 border rounded p-2"
            required
        />

        <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-1/2 border rounded p-2"
            required
        />
        </div>

        {/* Image Upload */}
        <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="block"
        />


      {/* Image previews */}
      <div className="flex gap-3 flex-wrap">
        {existingImages.map((img) => (
          <div key={img.filename} className="relative h-14 w-14">
            <img
              src={img.url}
              className="h-14 w-14 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeExistingImage(img.filename)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        {imagePreviews.map((src, index) => (
          <div key={index} className="relative h-14 w-14">
            <img
              src={src}
              className="h-14 w-14 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        variant="contained"
        className="!bg-green-600 hover:!bg-green-700"
      >
        {mode === "edit" ? "Update Food" : "Add Food"}
      </Button>
    </form>
  );
};

export default FoodForm;