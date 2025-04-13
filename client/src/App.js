import { useState, useEffect, useCallback, useMemo } from "react" // Added useMemo
import { Calendar, momentLocalizer, Views } from "react-big-calendar" // Import Views
import moment from "moment"
// import { useDispatch, useSelector } from "react-redux"
// import { fetchEvents, createEvent, updateEvent, deleteEvent } from "./redux/actions/eventActions"
// import { fetchGoals } from "./redux/actions/goalActions"
import EventModal from "./components/EventModal"
import Toolbar from "./components/Toolbar" // <-- Import Toolbar
import GoalsSidebar from "./components/GoalsSidebar" // <-- Import new Sidebar
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./App.css" // Ensure layout styles are imported

//Somechanges

const localizer = momentLocalizer(moment)
const allViews = Object.keys(Views).map((k) => Views[k]) // ['month', 'week', 'day', 'agenda']

function App() {
  // // Redux stuff - still learning how this works!
  // const dispatch = useDispatch()
  // const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events)

  // Local state - lots of variables!
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)

  // --- New State for Navigation ---
  const [currentDate, setCurrentDate] = useState(new Date()) // Today's date initially
  const [currentView, setCurrentView] = useState(Views.MONTH) // Default view

  // // Fetch events from Redux
  // useEffect(() => {
  //   // Load events when component mounts
  //   dispatch(fetchEvents())
  //   dispatch(fetchGoals())
  // }, [dispatch])

  // --- Modal Handlers ---
  const handleSelectSlot = useCallback(({ start, end }) => {
    // This runs when user clicks on an empty slot in calendar
    setSaveError(null)
    setModalData({ start, end, allDay: !start.getHours() && !start.getMinutes() }) // Guess allDay based on slot
    setIsEditing(false)
    setShowModal(true)
  }, [])

  const handleSelectEvent = useCallback((event) => {
    // This runs when user clicks on an existing event
    setSaveError(null)
    setModalData(event)
    setIsEditing(true)
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    // Close the modal and reset everything
    setShowModal(false)
    setModalData(null)
    setIsEditing(false)
    setSaveError(null)
    setIsSaving(false)
  }, [])

  // Open modal for creation (triggered by Sidebar button)
  const handleCreateClick = useCallback(() => {
    // Create a new event starting now
    const now = new Date()
    setSaveError(null)
    setModalData({
      start: now,
      end: moment(now).add(1, "hour").toDate(), // Default 1 hour duration
      allDay: false,
    })
    setIsEditing(false)
    setShowModal(true)
  }, [])

  // // --- Save/Delete Handlers ---
  // const handleSaveEvent = async (eventDataFromModal) => {
  //   // Save the event to the database
  //   setIsSaving(true)
  //   setSaveError(null)
  //   try {
  //     let savedEvent
  //     if (isEditing && modalData?._id) {
  //       // Update existing event
  //       savedEvent = await dispatch(updateEvent(modalData._id, eventDataFromModal))
  //     } else {
  //       // Create new event
  //       savedEvent = await dispatch(createEvent(eventDataFromModal))
  //     }
  //     handleCloseModal()
  //   } catch (error) {
  //     // Something went wrong!
  //     console.error("Error saving event:", error.response ? error.response.data : error)
  //     setSaveError(error.response?.data?.msg || "Could not save event.")
  //     setIsSaving(false)
  //   }
  // }

  // const handleDeleteEvent = async (eventId) => {
  //   // Delete an event from the database
  //   if (!eventId) return
  //   setIsSaving(true)
  //   setSaveError(null)
  //   try {
  //     await dispatch(deleteEvent(eventId))
  //     handleCloseModal()
  //   } catch (error) {
  //     // Something went wrong!
  //     console.error("Error deleting event:", error)
  //     setSaveError(error.response?.data?.msg || "Could not delete event.")
  //     setIsSaving(false)
  //   }
  // }

  // --- Navigation Handlers ---
  const handleNavigate = useCallback((newDate, view, action) => {
    // This is called when user navigates to a different date
    console.log("Navigate action:", action, " New Date:", newDate)
    setCurrentDate(newDate) // Update the date state
  }, [])

  const handleViewChange = useCallback((newView) => {
    // This is called when user changes the view (month, week, day)
    console.log("View change:", newView)
    setCurrentView(newView) // Update the view state
  }, [])

  // Handler for "Today" button clicks (from Sidebar or Toolbar)
  const goToToday = useCallback(() => {
    // Go back to today's date
    setCurrentDate(new Date()) // Set date state to now
  }, [])

  // --- Event Styling ---
  const eventStyleGetter = useCallback((event) => {
    // This makes the events look pretty with different colors
    const backgroundColor = event.color || "#3174ad"
    return {
      style: { backgroundColor, borderRadius: "3px", opacity: 0.9, color: "white", border: "0px", display: "block" },
    }
  }, [])

  // --- Toolbar Label Formatting ---
  const toolbarLabel = useMemo(() => {
    // This formats the date label in the toolbar
    const date = moment(currentDate)
    if (currentView === Views.MONTH) return date.format("MMMM YYYY")
    if (currentView === Views.WEEK) {
      const startOfWeek = date.startOf("week").format("MMM D")
      const endOfWeek = date.endOf("week").format("MMM D, YYYY")
      return `${startOfWeek} – ${endOfWeek}`
    }
    if (currentView === Views.DAY) return date.format("dddd, MMMM D, YYYY")
    if (currentView === Views.AGENDA) return date.format("MMMM YYYY") + " Agenda"
    return ""
  }, [currentDate, currentView])

  // --- Drag and Drop Handlers ---
  const handleTaskDragStart = (task) => {
    // When user starts dragging a task
    setDraggedTask(task)
  }

  const handleCalendarDragOver = (e) => {
    e.preventDefault() // Allow drop
  }

  const handleCalendarDrop = (e) => {
    // When user drops a task on the calendar
    e.preventDefault()

    // Get the task data
    const taskData = JSON.parse(e.dataTransfer.getData("text/plain"))

    if (taskData.type === "task") {
      // Get the drop coordinates relative to the calendar
      const calendarRect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - calendarRect.left
      const y = e.clientY - calendarRect.top

      // Calculate the date from the drop position
      // This is a simplified approach - in a real app, you'd need to calculate
      // the exact date and time based on the calendar's current view and layout
      const now = new Date()

      // Open the modal with pre-filled data
      setSaveError(null)
      setModalData({
        title: taskData.name,
        color: taskData.color,
        start: now,
        end: moment(now).add(1, "hour").toDate(),
        allDay: false,
      })
      setIsEditing(false)
      setShowModal(true)
    }
  }

  // // --- Event Resizing and Moving ---
  // const handleEventResize = useCallback(
  //   ({ event, start, end }) => {
  //     // When user resizes an event
  //     dispatch(updateEvent(event._id, { ...event, start, end }))
  //   },
  //   [dispatch],
  // )

  // const handleEventDrop = useCallback(
  //   ({ event, start, end, allDay }) => {
  //     // When user drags an event to a new time/date
  //     dispatch(updateEvent(event._id, { ...event, start, end, allDay }))
  //   },
  //   [dispatch],
  // )

  return (
    // New Layout Structure
    <div className="app-container">
      {/* Sidebar */}
      <GoalsSidebar onCreateClick={handleCreateClick} onTodayClick={goToToday} onTaskDragStart={handleTaskDragStart} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Display global loading/error indicators */}
        {/*eventsLoading && <p className="loading-indicator">Loading events...</p>}
        {eventsError && !showModal && <p className="global-error">{eventsError}</p>}
        {saveError && !showModal && <p className="global-error">{saveError}</p>*/}

        {/* Custom Toolbar */}
        <Toolbar
          date={currentDate}
          view={currentView}
          views={allViews} // Pass available views
          label={toolbarLabel} // Pass formatted label
          onNavigate={(action) => {
            // Handle navigation actions from Toolbar buttons
            if (action === "TODAY") goToToday()
            // Let react-big-calendar handle PREV/NEXT internally via its onNavigate prop
            else handleNavigate(currentDate, currentView, action) // Trigger internal navigation
          }}
          onViewChange={handleViewChange} // Pass view change handler
        />

        {/* Calendar Area */}
        <div className="calendar-container" onDragOver={handleCalendarDragOver} onDrop={handleCalendarDrop}>
          <Calendar
            localizer={localizer}
            // events={events}
            startAccessor="start"
            endAccessor="end"
            allDayAccessor="allDay"
            style={{ height: "100%" }} // Let container control height
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            popup
            resizable
            // onEventResize={handleEventResize}
            // onEventDrop={handleEventDrop}
            // --- Connect Navigation State ---
            view={currentView} // Control the current view
            date={currentDate} // Control the current date
            onNavigate={handleNavigate} // Handle date changes
            onView={handleViewChange} // Handle view changes
            views={allViews} // Tell RBC the available views
            // --- Disable RBC's built-in toolbar ---
            components={{
              toolbar: () => null, // Render nothing for the default toolbar
            }}
          />
        </div>
      </div>

      {/* Event Modal (Rendered top-level for stacking context) */}
      {showModal && (
        <EventModal
          event={isEditing ? modalData : null}
          initialData={!isEditing ? modalData : null}
          onClose={handleCloseModal}
          // onSave={handleSaveEvent}
          // onDelete={isEditing ? handleDeleteEvent : undefined}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </div>
  )
}

export default App
