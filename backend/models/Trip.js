const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
        type: String,
        default: ""
    },
    activities: {
      type: [activitySchema],
      default: []
    },
    
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    originalId: {
        type: String,
        default: ""
        },

        image: {
        type: String,
        default: ""
        },

        country: {
        type: String,
        default: ""
        },

        description: {
        type: String,
        default: ""
        },

        days: {
        type: Number,
        default: 1
        },

        style: {
        type: String,
        default: "balanced"
        },

    destination: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    budget: {
      type: Number,
      required: true,
      min: 0
    },

    travelers: {
      type: Number,
      default: 1,
      min: 1
    },

    travelStyle: {
      type: String,
      default: "balanced"
    },

    itinerary: {
      type: [daySchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);