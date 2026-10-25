import { apiRequest } from "./api";

export const saveTrip = async (tripData) => {
  return apiRequest("/trips", {
    method: "POST",
    body: JSON.stringify(tripData),
  });
};

export const getMyTrips = async () => {
  return apiRequest("/trips");
};

export const getTripById = async (id) => {
  return apiRequest(`/trips/${id}`);
};

export const updateTrip = async (id, tripData) => {
  return apiRequest(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(tripData),
  });
};

export const deleteTrip = async (id) => {
  return apiRequest(`/trips/${id}`, {
    method: "DELETE",
  });
};