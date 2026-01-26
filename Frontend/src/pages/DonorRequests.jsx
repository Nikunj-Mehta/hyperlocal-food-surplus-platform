import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/time";

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/requests/received");
        setRequests(res.data.data);
      } catch (err) {
        alert("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const handleApprove = async (id) => {
    await api.put(`/requests/${id}/approve`);
    window.location.reload();
  };
  
  const handleReject = async (id) => {
    await api.put(`/requests/${id}/reject`);
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Requests on My Food</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No requests yet.</p>
        ) : (
        <div className="space-y-6">
            {requests.map((item) => (
            <div
                key={item.food._id}
                className="border rounded-lg p-4 bg-white shadow"
            >
                {/* FOOD INFO */}
                <div className="flex gap-4 items-center mb-4 cursor-pointer" onClick={() => navigate(`/foods/${item.food._id}`)}>
                {item.food.images?.length > 0 && (
                    <img
                    src={item.food.images[0].url}
                    alt={item.food.title}
                    className="h-24 w-24 object-cover rounded"
                    />
                )}

                <div>
                    <h2 className="text-xl font-semibold">{item.food.title}</h2>
                    <p className="text-sm text-gray-600">Available: {item.food.quantity} {item.food.quantityUnit}</p>
                    <p className="text-sm text-gray-600">Status: {item.food.status.toUpperCase()}</p>
                    <p className="text-xs text-gray-500"> Added {timeAgo(item.food.createdAt)} </p>
                </div>
                </div>

                {/* REQUESTS ON THIS FOOD */}
                <div className="space-y-3">
                {item.requests.map((req) => (
                    <div
                    key={req._id}
                    className="border rounded-md p-3 bg-gray-50"
                    >
                    <p className="text-sm">
                        <strong>Requested Qty:</strong> {req.requestedQuantity}
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

                    {/* Receiver contact (only after approval) */}
                    {req.status === "approved" && req.requester.phone && (
                      <div className="mt-2 text-sm text-green-700">
                        <p className="font-medium"> Contact <i>{req.requester.name}</i> to donate the food </p>
                        <p className="mt-1"> 📞 {req.requester.phone} </p>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    {req.status === "pending" && (
                        <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(req._id)}
                          className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
                        >
                          Reject
                        </button>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
  );
};

export default DonorRequests;