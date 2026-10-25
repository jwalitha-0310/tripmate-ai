import { Bookmark, MapPin, Wallet, CalendarDays } from "lucide-react";

function SavedTrips({ savedTrips, onViewTrip, onDeleteTrip }) {
  return (
    <main className="saved-page">
      <div className="saved-container">
        <div className="saved-header">
          <span className="saved-badge">
            🔖 Your Adventures
          </span>

          <h1>My Trips</h1>

          <p>
            Your saved travel plans, ready whenever you are.
          </p>
        </div>

        {savedTrips.length === 0 ? (
          <div className="saved-empty">
            <div className="empty-icon">
              🧳
            </div>

            <h2>No saved trips yet</h2>

            <p>
              Generate a trip and save it here to access
              your travel plans anytime.
            </p>
          </div>
        ) : (
          <div className="saved-grid">
            {savedTrips.map((trip) => (
              <article
                className="saved-trip-card"
                key={trip._id}
              >
                <div className="saved-trip-image">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                  />

                  <span>
                    <Bookmark size={14} />
                    Saved
                  </span>
                </div>

                <div className="saved-trip-content">
                  <h2>
                    {trip.destination}
                  </h2>

                  <div className="saved-trip-location">
                    <MapPin size={15} />
                    {trip.country}
                  </div>

                  <div className="saved-trip-details">
                    <div>
                      <CalendarDays size={15} />
                      {trip.days} Days
                    </div>

                    <div>
                      <Wallet size={15} />
                      ₹{Number(trip.budget).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="saved-trip-actions">
                    <button
                      className="view-trip-btn"
                      onClick={() => onViewTrip(trip)}
                    >
                      View Trip
                    </button>

                    <button
                      className="delete-trip-btn"
                      onClick={() => onDeleteTrip(trip._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedTrips;