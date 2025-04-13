const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    start: {
      type: Date,
      required: [true, "Please add a start date"],
    },
    end: {
      type: Date,
      required: [true, "Please add an end date"],
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#3174ad", // Default calendar blue
    },
    category: {
      type: String,
      enum: ["exercise", "eating", "work", "relax", "family", "social"],
      default: "work",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure end date is after start date (basic validation example)
EventSchema.pre("save", function (next) {
  if (this.start && this.end && this.start > this.end) {
    next(new Error("End date must be after start date"))
  } else {
    next()
  }
})
EventSchema.pre("findOneAndUpdate", function (next) {
  // Access update data using this.getUpdate()
  const update = this.getUpdate()
  const start = update.$set?.start ? new Date(update.$set.start) : this.start
  const end = update.$set?.end ? new Date(update.$set.end) : this.end

  if (start && end && start > end) {
    next(new Error("End date must be after start date"))
  } else {
    next()
  }
})

module.exports = mongoose.model("Event", EventSchema)
