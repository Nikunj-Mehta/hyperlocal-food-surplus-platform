import api from "./axios";

// Donor: pending requests not yet seen
export const getDonorNotificationCount = async () => {
  const res = await api.get("/requests/notifications/donor");
  return res.data.count;
};

// Receiver: approved / rejected requests not yet seen
export const getReceiverNotificationCount = async () => {
  const res = await api.get("/requests/notifications/receiver");
  return res.data.count;
};
