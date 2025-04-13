"use client"

import { useState, useEffect } from "react"
import moment from "moment"
import "./EventModal.css"

// Define some color options
const colorOptions = [
  { value: "#3174ad", label: "Blue" }, // Default Blue
  { value: "#28a745", label: "Green" },
  { value: "#ffc107", label: "Yellow" },
  { value: "#dc3545", label: "Red" },
  { value: "#6f42c1", label: "Purple" },
]

// Define category options
const categoryOptions = [
  { value: "exercise", label: "Exercise" },
  { value: "eating", label: "Eating" },
  { value: "work", label: "Work" },
  { value: "relax", label: "Relax" },
  { value: "family", label: "Family" },
  { value: "social", label: "Social" },
]

// Map categories to colors - this makes it easier to match colors to categories
const categoryColors = {
  exercise: "#28a745", // Green
  eating: "#ffc107", // Yellow
  work: "#3174ad", // Blue
  relax: "#6f42c1", // Purple
  family: "#dc3545", // Red
  social: "#ff9800", // Orange
}

function EventModal({ event, initialData, onClose, onSave, onDelete, isSaving, saveError }) {
  // Receive saving state/error props
  // Check if we're editing an existing event or creating a new one
  const isEditing = !!event

  // State for form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("") // New state
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [allDay, setAllDay] = useState(false) // New state
  const [color, setColor] = useState(colorOptions[0].value) // Default color
  const [category, setCategory] = useState("work") // Default category

  // Effect to populate form when event or initialData changes
  useEffect(() => {
    // Get the data from either the event (if editing) or initialData (if creating)
    const currentData = isEditing ? event : initialData
    if (currentData) {
      // Fill in all the form fields with the event data
      setTitle(currentData.title || "")
      setDescription(currentData.description || "")
      setStart(moment(currentData.start).format(currentData.allDay ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"))
      setEnd(moment(currentData.end).format(currentData.allDay ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"))
      setAllDay(!!currentData.allDay)
      setColor(currentData.color || colorOptions[0].value)
      setCategory(currentData.category || "work")
    } else {
      // Reset everything if there's no data
      setTitle("")
      setDescription("")
      const now = moment()
      setStart(now.format("YYYY-MM-DDTHH:mm"))
      setEnd(now.add(1, "hour").format("YYYY-MM-DDTHH:mm"))
      setAllDay(false)
      setColor(colorOptions[0].value)
      setCategory("work")
    }
  }, [event, initialData, isEditing])

  // Handle save click
  const handleSaveClick = (e) => {
    e.preventDefault()
    // Make sure required fields are filled in
    if (!title || !start || !end) {
      alert("Please fill in Title, Start, and End.") // Simple validation
      return
    }

    // Format start/end based on allDay status
    let finalStart, finalEnd
    if (allDay) {
      // For full-day events, send just the date part (start of day in UTC)
      finalStart = moment(start).startOf("day").toISOString()
      // End date for full-day events is often exclusive, so start of the *next* day
      finalEnd = moment(end).startOf("day").add(1, "day").toISOString()
    } else {
      finalStart = new Date(start).toISOString()
      finalEnd = new Date(end).toISOString()
    }

    // Update color based on category if user hasn't manually changed it
    const eventColor = color === colorOptions[0].value ? categoryColors[category] : color

    // Create the event object to save
    const eventDataToSave = {
      title,
      description, // Include description
      start: finalStart,
      end: finalEnd,
      allDay, // Include allDay
      color: eventColor, // Use category color or manual color
      category, // Include category
    }
    onSave(eventDataToSave) // Pass data up to App.js
  }

  // Handle delete click
  const handleDeleteClick = () => {
    if (isEditing && event?._id && onDelete) {
      onDelete(event._id) // Call parent delete handler
    }
  }

  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value
    setCategory(newCategory)
    // Auto-update color based on category
    setColor(categoryColors[newCategory])
  }

  // Determine input type based on allDay
  const dateTimeInputType = allDay ? "date" : "datetime-local"
  const dateTimeFormat = allDay ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>
        {/* Display Save Error */}
        {saveError && <p className="modal-error">Error: {saveError}</p>}

        <form onSubmit={handleSaveClick}>
          {/* All Day Checkbox */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => {
                const isChecked = e.target.checked
                setAllDay(isChecked)
                // Update date formats if checkbox is toggled
                setStart(moment(start).format(isChecked ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"))
                setEnd(moment(end).format(isChecked ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"))
              }}
            />
            All Day
          </label>

          {/* Title Input */}
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
          </label>

          {/* Category Dropdown */}
          <label>
            Category:
            <select value={category} onChange={handleCategoryChange}>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {/* Description Textarea */}
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
          </label>

          {/* Start Date/Time Input */}
          <label>
            Start:
            <input
              type={dateTimeInputType}
              value={moment(start).format(dateTimeFormat)}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>

          {/* End Date/Time Input */}
          <label>
            End:
            <input
              type={dateTimeInputType}
              value={moment(end).format(dateTimeFormat)}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </label>

          {/* Color Selector */}
          <label>
            Color:
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ backgroundColor: opt.value }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            {/* Disable button while saving */}
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            {isEditing && onDelete && (
              <button type="button" onClick={handleDeleteClick} className="delete-button" disabled={isSaving}>
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className="cancel-button" disabled={isSaving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
