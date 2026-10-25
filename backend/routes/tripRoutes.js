const express = require("express");
const mongoose = require("mongoose");

const Trip = require("../models/Trip");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below require authentication
router.use(protect);

// Validate the trip data before saving
function validateTrip(body) {
  const {
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    travelStyle,
    itinerary
  } = body;

  if (
    typeof destination !== "string" ||
    !destination.trim() ||
    destination.length > 150
  ) {
    return "A valid destination is required";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    !startDate ||
    !endDate ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return "Valid trip dates are required";
  }

  if (
    typeof budget !== "number" ||
    !Number.isFinite(budget) ||
    budget < 0
  ) {
    return "Budget must be a non-negative number";
  }

  if (
    travelers !== undefined &&
    (!Number.isInteger(travelers) || travelers < 1)
  ) {
    return "Travelers must be a positive integer";
  }

  if (
    travelStyle !== undefined &&
    typeof travelStyle !== "string"
  ) {
    return "Travel style must be a string";
  }

  if (itinerary !== undefined) {
    if (!Array.isArray(itinerary)) {
      return "Itinerary must be an array";
    }

    for (const day of itinerary) {
      if (
        !Number.isInteger(day.day) ||
        day.day < 1 ||
        !Array.isArray(day.activities)
      ) {
        return "Invalid itinerary day";
      }

      for (const activity of day.activities) {
        if (
          typeof activity.title !== "string" ||
          !activity.title.trim() ||
          typeof activity.cost !== "number" ||
          !Number.isFinite(activity.cost) ||
          activity.cost < 0
        ) {
          return "Invalid itinerary activity";
        }
      }
    }
  }

  return null;
}

// CREATE TRIP
router.post("/", async (req, res) => {
  try {
    const error = validateTrip(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    // Whitelist allowed fields.
    // Never accept userId from the frontend.
    const {
        originalId,
        destination,
        image,
        country,
        description,
        days,
        style,
        startDate,
        endDate,
        budget,
        travelers,
        travelStyle,
        itinerary
    } = req.body;

    const trip = await Trip.create({
    userId: req.userId,
    originalId,
    destination,
    image,
    country,
    description,
    days,
    style,
    startDate,
    endDate,
    budget,
    travelers,
    travelStyle,
    itinerary
    });

    res.status(201).json({
      message: "Trip saved successfully",
      trip
    });

  } catch (error) {
    console.error("Create trip error:", error.message);

    res.status(500).json({
      message: "Failed to save trip"
    });
  }
});

// GET ALL TRIPS FOR LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(trips);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trips"
    });
  }
});

// GET SINGLE TRIP
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json(trip);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trip"
    });
  }
});

// UPDATE TRIP
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const error = validateTrip(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      travelStyle,
      itinerary
    } = req.body;

    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      {
        $set: {
          destination,
          startDate,
          endDate,
          budget,
          travelers: travelers ?? 1,
          travelStyle: travelStyle ?? "balanced",
          itinerary: itinerary ?? []
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json({
      message: "Trip updated successfully",
      trip
    });

  } catch (error) {
        console.error("UPDATE TRIP ERROR:", error);

        res.status(500).json({
            message: "Failed to update trip"
        });
        }
});

// DELETE TRIP
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json({
      message: "Trip deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete trip"
    });
  }
});

module.exports = router;