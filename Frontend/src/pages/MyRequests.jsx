import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(res.data.data);
      } catch (error) {
        alert("Failed to load your requests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) {
    return <div className="p-6">Loading your requests...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-600">
        My Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">You haven’t made any requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border rounded-lg p-4 shadow-sm flex gap-4"
            >
              {/* Food image */}
              {req.food?.images?.length > 0 && (
                <img
                  src={req.food.images[0].url}
                  alt={req.food.title}
                  className="h-24 w-24 object-cover rounded cursor-pointer"
                  onClick={() => navigate(`/foods/${req.food._id}`)}
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <h2
                  className="font-semibold text-lg cursor-pointer hover:underline"
                  onClick={() => navigate(`/foods/${req.food._id}`)}
                >
                  {req.food?.title}
                </h2>

                <p className="text-sm text-gray-600">
                  Requested Quantity: {req.requestedQuantity}{" "}
                  {req.food?.quantityUnit}
                </p>

                <p className="text-sm text-gray-600">
                  Address: {req.food?.address}
                </p>

                {/* Status badge */}
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>
                {/* Donor contact (only after approval) */}
                {req.status === "approved" && req.food?.author?.phone && (
                  <div className="mt-3 text-sm text-green-700">
                    <p className="font-medium"> Contact <i>{req.food.author.name}</i> to receive the food </p>
                    <p className="mt-1"> 📞 {req.food.author.phone}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;