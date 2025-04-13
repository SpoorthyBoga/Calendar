const express = require("express")
const router = express.Router()
const Event = require("../models/event")

// GET /api/events - (No changes needed)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
    res.json(events)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// POST /api/events - Handle new fields
router.post("/", async (req, res) => {
  // Destructure new fields from request body
  const { title, description, start, end, allDay, color, category } = req.body

  if (!title || !start || !end) {
    return res.status(400).json({ msg: "Please include title, start, and end dates" })
  }

  try {
    const newEvent = new Event({
      title,
      description, // Add description
      start: new Date(start),
      end: new Date(end),
      allDay: !!allDay, // Ensure boolean
      color, // Add color
      category, // Add category
    })

    const event = await newEvent.save() // Mongoose validation (like date check) runs here
    res.status(201).json(event)
  } catch (err) {
    console.error("Error creating event:", err.message)
    // Send back specific validation errors if available
    if (err.name === "ValidationError" || err.message.includes("End date must be after start date")) {
      return res.status(400).json({ msg: err.message })
    }
    res.status(500).send("Server Error")
  }
})

// PUT /api/events/:id - Handle new fields
router.put("/:id", async (req, res) => {
  // Destructure all possible fields from body
  const { title, description, start, end, allDay, color, category } = req.body
  const eventId = req.params.id

  // Build event object based on fields actually submitted
  const eventFields = {}
  if (title !== undefined) eventFields.title = title
  if (description !== undefined) eventFields.description = description
  if (start) eventFields.start = new Date(start)
  if (end) eventFields.end = new Date(end)
  // Explicitly check for undefined because false is a valid value
  if (allDay !== undefined) eventFields.allDay = !!allDay
  if (color !== undefined) eventFields.color = color
  if (category !== undefined) eventFields.category = category

  try {
    let event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ msg: "Event not found" })

    // Add authorization check here in a real app

    // Use { new: true, runValidators: true } to return updated doc and run schema validation
    event = await Event.findByIdAndUpdate(eventId, { $set: eventFields }, { new: true, runValidators: true })

    res.json(event)
  } catch (err) {
    console.error("Error updating event:", err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" })
    }
    // Send back specific validation errors if available
    if (err.name === "ValidationError" || err.message.includes("End date must be after start date")) {
      return res.status(400).json({ msg: err.message })
    }
    res.status(500).send("Server Error")
  }
})

// DELETE /api/events/:id - (No changes needed)
router.delete("/:id", async (req, res) => {
  const eventId = req.params.id
  try {
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ msg: "Event not found" })

    // Add authorization check here

    await Event.findByIdAndDelete(eventId)
    res.json({ msg: "Event removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router
