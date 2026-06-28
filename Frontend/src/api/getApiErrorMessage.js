const getApiErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.request) {
    return "Unable to connect to the server. Please make sure the backend is running on port 8080.";
  }

  return fallback;
};

export default getApiErrorMessage;
