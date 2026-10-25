import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Itinerary from "./pages/Itinerary";
import Explore from "./pages/Explore";
import SavedTrips from "./pages/SavedTrips";
import Auth from "./pages/Auth";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { LogOut, UserCircle2 } from "lucide-react";
import Toast from "./components/Toast";
import "./AppExtras.css";

import { logoutUser } from "./services/authService";
import {
  saveTrip,
  getMyTrips,
  deleteTrip,
} from "./services/tripService";

function App() {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trip, setTrip] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState("");

  // Authentication
  const [user, setUser] = useState(null);

  // Trips now come from MongoDB instead of localStorage
  const [savedTrips, setSavedTrips] = useState([]);

  // Track saved state using the generated trip's original ID
  
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
      setToast({
        id: Date.now(),
        message,
        type,
      });
  };

  // Load saved trips after login
  useEffect(() => {
    if (!user) return;

    const loadTrips = async () => {
      try {
        const trips = await getMyTrips();

        setSavedTrips(trips);

        setSavedTripIds(
          trips.map((savedTrip) => savedTrip.originalId).filter(Boolean)
        );
      } catch (err) {
        console.error("Failed to load saved trips:", err);
        setError(err.message);
      }
    };

    loadTrips();
  }, [user]);
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setPage("home");
    setError("");
  };

  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setTrip(null);
    setSavedTrips([]);
    setSavedTripIds([]);
    setToast(null);
    setPage("home");
    setError("");
  };

  const generateTrip = async (tripData) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Preserve your existing itinerary-generation endpoint
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message || "Unable to generate trip."
        );
      }

      const data = await response.json();

      console.log("API Response:", data);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setTrip(data);
      setPage("itinerary");
    } catch (err) {
      console.error("Trip generation failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

const handleSaveTrip = async () => {
  if (!trip) return;

  try {
    // Don't save the same generated trip twice
    if (
      savedTrips.some(
        (savedTrip) =>
          savedTrip._id === trip._id ||
          (trip.id && savedTrip.originalId === String(trip.id))
      )
    ) {
      showToast("This trip is already saved!", "error");
      return;
    }

    const days = Number(trip.days) || 1;

    // Use actual dates when the planner provides them.
    // Otherwise, create dates starting today for this MVP.
    const startDate = trip.startDate
      ? new Date(trip.startDate)
      : new Date();

    const endDate = trip.endDate
      ? new Date(trip.endDate)
      : new Date(
          startDate.getTime() +
            (days - 1) * 24 * 60 * 60 * 1000
        );

    const tripData = {
      originalId: trip.id ? String(trip.id) : "",

      destination: trip.destination,

      image: trip.image || "",

      country: trip.country || "",

      description: trip.description || "",

      days,

      style: trip.style || "balanced",

      startDate: startDate.toISOString(),

      endDate: endDate.toISOString(),

      budget: Number(trip.budget) || 0,

      travelers: Number(trip.travelers) || 1,

      travelStyle: trip.style || "balanced",

      itinerary: (trip.itinerary || []).map((day) => ({
        day: Number(day.day),
        title: day.title || "",
        activities: (day.activities || []).map((activity) => ({
          time: activity.time || "",
          title: activity.title || "",
          description: activity.description || "",
          location: activity.location || "",
          cost: Number(activity.cost) || 0
        }))
      }))
    };

    const result = await saveTrip(tripData);

    setSavedTrips((currentTrips) => [
      result.trip,
      ...currentTrips
    ]);

    showToast("Your trip has been saved successfully!");
  } catch (error) {
    console.error("Save trip failed:", error);
    showToast(error.message, "error");
  }
};

  const handleBackToPlanner = () => {
    setPage("home");
    setError("");
  };

  const handleViewSavedTrip = (savedTrip) => {
    setTrip(savedTrip);
    setPage("itinerary");
    setError("");
  };

  const handleDeleteSavedTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);

      setSavedTrips((currentTrips) =>
        currentTrips.filter((savedTrip) => savedTrip._id !== tripId)
      );

      showToast("Your trip has been deleted successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handlePlanFromExplore = (destination) => {
    setSelectedDestination(destination.name);
    setPage("home");
    setError("");
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar page={page} setPage={setPage} />

      <div className="trip-user-bar">
      <div className="trip-user-info">
        <UserCircle2 size={22} />

        <span>
          Welcome, <strong>{user.name}</strong>!
        </span>
      </div>

      <button
        type="button"
        className="trip-logout-btn"
        onClick={handleLogout}
      >
        <LogOut size={17} />
        <span>Logout</span>
      </button>
    </div>


      {page === "home" && !loading && (
        <Home
          onGenerate={generateTrip}
          loading={loading}
          selectedDestination={selectedDestination}
        />
      )}

      {loading && <LoadingState />}

      {page === "itinerary" && trip && (
        <Itinerary
          trip={trip}
          onBack={handleBackToPlanner}
          onSave={handleSaveTrip}
          saved={savedTrips.some(
            (savedTrip) =>
              (trip._id && savedTrip._id === trip._id) ||
              (trip.id && savedTrip.originalId === String(trip.id))
          )}
                  />
      )}

      {page === "explore" && (
        <Explore onPlanTrip={handlePlanFromExplore} />
      )}

      {page === "saved" && (
        <SavedTrips
          savedTrips={savedTrips}
          onViewTrip={handleViewSavedTrip}
          onDeleteTrip={handleDeleteSavedTrip}
        />
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={() => {
            setError("");
            setPage("home");
          }}
        />
      )}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;