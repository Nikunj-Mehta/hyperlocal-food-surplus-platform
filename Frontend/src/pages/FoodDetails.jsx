import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatDate, timeAgo } from "../utils/time";
import MapView from "../components/MapView";
import { calculateDistance } from "../utils/distance";

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

  const [requests, setRequests] = useState([]); // To get requests received on my food listing

  const [hasRequested, setHasRequested] = useState(false); // To disable the request button when user has already sent request

  // Checks if user has already made the request then disable the request button
  useEffect(() => {
    if (user?.role === "receiver") {
      api.get("/requests/my").then((res) => {
        const alreadyRequested = res.data.data.some(
          (req) => req.food._id === id
        );
        setHasRequested(alreadyRequested);
      });
    }
  }, [id, user]);
  

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

  let distanceKm = null;

  if (lat && lng && food?.location?.coordinates?.length === 2 ) {
    distanceKm = calculateDistance(
      Number(lat),
      Number(lng),
      food.location.coordinates[1],
      food.location.coordinates[0]
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">{food.title}</h1>

        <p className="text-sm text-gray-500 mb-2"> Added on {formatDate(food.createdAt)} • {timeAgo(food.createdAt)} </p>

  
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

        {/* Map – Food + Requesters (Donor only) */}
        <MapView
          lat={food.location.coordinates[1]}
          lng={food.location.coordinates[0]}
          label={food.title}
        />

        {/* Actions */}
        <div className="mt-6 flex gap-3">
        {user?.role === "receiver" &&
          food.status === "available" &&
          !isOwner && (
            <Button
              variant="contained"
              disabled={hasRequested}
              className={`${
                hasRequested
                  ? "!bg-gray-400 cursor-not-allowed"
                  : "!bg-green-600 hover:!bg-green-700"
              }`}
              onClick={() => {
                if (!hasRequested) setOpenRequestModal(true);
              }}
            >
              {hasRequested ? "Request Sent" : "Request Food"}
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
          {requests.map((req) => {
              const foodCoords = food?.location?.coordinates;
              const reqCoords = req.requesterLocation?.coordinates;

              const distanceKm =
                foodCoords?.length === 2 && reqCoords?.length === 2
                  ? calculateDistance(
                      foodCoords[1],
                      foodCoords[0],
                      reqCoords[1],
                      reqCoords[0]
                    ).toFixed(2)
                  : null;

              return (
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

                  {reqCoords?.length === 2 && (
                    <p className="text-sm">
                      <strong>Location:</strong>{" "}
                      {reqCoords[1]}, {reqCoords[0]}
                    </p>
                  )}

                  {distanceKm && (
                    <p className="text-sm text-gray-700">
                      <strong>Distance:</strong> {distanceKm} km away
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
                          api
                            .patch(`/requests/${req._id}/approve`)
                            .then(() => window.location.reload())
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
                        onClick={() =>
                          api
                            .patch(`/requests/${req._id}/reject`)
                            .then(() => window.location.reload())
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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

            {distanceKm && (
              <p className="text-sm text-gray-600 mb-3">
                📍This food is approximately{" "}
                <span className="font-semibold">
                  {distanceKm.toFixed(2)} km
                </span>{" "}
                away from you
              </p>
            )}
  
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
                    setHasRequested(true);
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