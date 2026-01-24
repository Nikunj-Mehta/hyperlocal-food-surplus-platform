import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestQty, setRequestQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.role === "donor") {
      api
        .get(`/foods/${id}/requests`)
        .then((res) => setRequests(res.data.requests))
        .catch(() => {});
    }
  }, [id, user]);  

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/foods/${id}`);
        setFood(res.data.data);
      } catch (err) {
        alert("Food not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, navigate]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!food) return null;

  const isOwner = user && food.author?._id === user._id;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">{food.title}</h1>
  
        {/* Status */}
        <span
          className={`inline-block mb-4 px-3 py-1 text-sm rounded ${
            food.status === "available"
              ? "bg-green-100 text-green-700"
              : food.status === "requested"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {food.status.toUpperCase()}
        </span>
  
        {/* Images */}
        {food.images?.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-6">
            {food.images.map((img) => (
              <img
                key={img.filename}
                src={img.url}
                alt="food"
                className="h-32 w-32 object-cover rounded border"
              />
            ))}
          </div>
        )}
  
        {/* Details */}
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Quantity:</strong> {food.quantity} {food.quantityUnit}
          </p>
          <p>
            <strong>Food Type:</strong> {food.foodType}
          </p>
          <p>
            <strong>Address:</strong> {food.address}
          </p>
          <p>
            <strong>Donor:</strong> {food.author?.name}
          </p>
        </div>
  
        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {user?.role === "receiver" &&
            food.status === "available" &&
            !isOwner && (
              <Button
                variant="contained"
                className="!bg-green-600 hover:!bg-green-700"
                onClick={() => setOpenRequestModal(true)}
              >
                Request Food
              </Button>
            )}
  
          {isOwner && (
            <Button
              variant="outlined"
              onClick={() => navigate(`/foods/${food._id}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Donor-only: Requests on this food */}
      {user?.role === "donor" && requests.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-6">
          <h2 className="text-xl font-semibold mb-4">
            Requests on this food
          </h2>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <p className="text-sm">
                  <strong>Requested Quantity:</strong>{" "}
                  {req.requestedQuantity}
                </p>

                <p className="text-sm">
                  <strong>Requested By:</strong>{" "}
                  {req.requester.name} ({req.requester.email})
                </p>

                {req.requesterLocation?.coordinates?.length === 2 && (
                  <p className="text-sm">
                    <strong>Location:</strong>{" "}
                    {req.requesterLocation.coordinates[1]},{" "}
                    {req.requesterLocation.coordinates[0]}
                  </p>
                )}

                <p className="text-sm mt-1">
                  <strong>Status:</strong>{" "}
                  {req.status.toUpperCase()}
                </p>

                {req.status === "pending" && (
                  <div className="mt-3 flex gap-3">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      onClick={() =>
                        api.patch(`/requests/${req._id}/approve`)
                          .then(() => window.location.reload())
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
                      onClick={() =>
                        api.patch(`/requests/${req._id}/reject`)
                          .then(() => window.location.reload())
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

  
      {/* Request Modal */}
      {openRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">
              Request {food.title}
            </h2>
  
            <p className="text-sm text-gray-600 mb-2">
              Available: {food.quantity} {food.quantityUnit}
            </p>
  
            <input
              type="number"
              min="1"
              max={food.quantity}
              value={requestQty}
              onChange={(e) => setRequestQty(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />

            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />

            <input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />
  
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenRequestModal(false)}
                className="text-sm text-gray-600"
              >
                Cancel
              </button>
  
              <button
                disabled={submitting}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    if (!lat || !lng) {
                      alert("Please enter both latitude and longitude");
                      setSubmitting(false);
                      return;
                    }                    
                    await api.post(`/foods/${food._id}/request`, {
                      quantity: requestQty,
                      location: {
                        coordinates: [Number(lng), Number(lat)],
                      },
                    });
                    alert("Request sent successfully");
                    setOpenRequestModal(false);
                  } catch (err) {
                    alert(
                      err.response?.data?.error ||
                        "Failed to send request"
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  );  
};

export default FoodDetails;