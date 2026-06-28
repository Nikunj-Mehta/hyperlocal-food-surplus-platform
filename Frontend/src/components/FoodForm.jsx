import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";

const FoodForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(mode, initialData));
  const [existingImages, setExistingImages] = useState(() =>
    mode === "edit" ? initialData.images || [] : []
  );
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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
    setExistingImages((prev) => prev.filter((img) => img.filename !== filename));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
    newImages.forEach((img) => fd.append("images", img));
    existingImages.forEach((img) => fd.append("existingImages", img.filename));

    onSubmit(fd);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={3}>
      <TextField
        label="Food title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
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
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          select
          label="Quantity unit"
          name="quantityUnit"
          value={formData.quantityUnit}
          onChange={handleChange}
          fullWidth
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
        value={formData.foodType}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="edible">Edible</MenuItem>
        <MenuItem value="compost">Compost</MenuItem>
      </TextField>

      <TextField
        label="Pickup address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        required
      />



      <Box>
        <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlined />}>
          Add Images
          <input hidden type="file" multiple accept="image/*" onChange={handleImageChange} />
        </Button>
      </Box>

      {(existingImages.length > 0 || imagePreviews.length > 0) && (
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", rowGap: 1.5 }}>
          {existingImages.map((img) => (
            <ImagePreview
              key={img.filename}
              src={img.url}
              onRemove={() => removeExistingImage(img.filename)}
            />
          ))}

          {imagePreviews.map((src, index) => (
            <ImagePreview
              key={src}
              src={src}
              onRemove={() => removeNewImage(index)}
            />
          ))}
        </Stack>
      )}

      <Button type="submit" variant="contained" size="large">
        {mode === "edit" ? "Update Listing" : "Add Food"}
      </Button>
    </Stack>
  );
};

const ImagePreview = ({ src, onRemove }) => (
  <Box sx={{ position: "relative", width: 72, height: 72 }}>
    <Box
      component="img"
      src={src}
      alt="Food preview"
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
        onClick={onRemove}
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
);

const getInitialFormData = (mode, initialData) => {
  if (mode !== "edit" || !initialData?._id) {
    return {
      title: "",
      description: "",
      quantity: "",
      quantityUnit: "plates",
      foodType: "edible",
      address: "",
      latitude: "",
      longitude: "",
    };
  }

  return {
    title: initialData.title,
    description: initialData.description || "",
    quantity: initialData.quantity,
    quantityUnit: initialData.quantityUnit,
    foodType: initialData.foodType,
    address: initialData.address,
    latitude: initialData.location?.coordinates[1],
    longitude: initialData.location?.coordinates[0],
  };
};

export default FoodForm;
