"use client"

import { useState } from "react"
import moment from "moment"
import "./GoalsSidebar.css"

// Dummy data for goals and tasks
// In a real app, this would come from Redux and the database
const goalsData = [
  {
    id: 1,
    name: "Learn",
    color: "#28a745",
    tasks: [
      { id: 101, name: "AI based agents", color: "#28a745" },
      { id: 102, name: "MLE", color: "#28a745" },
      { id: 103, name: "DE related", color: "#28a745" },
      { id: 104, name: "Basics", color: "#28a745" },
    ],
  },
  {
    id: 2,
    name: "Health",
    color: "#dc3545",
    tasks: [
      { id: 201, name: "Morning run", color: "#dc3545" },
      { id: 202, name: "Gym workout", color: "#dc3545" },
    ],
  },
  {
    id: 3,
    name: "Work",
    color: "#3174ad",
    tasks: [
      { id: 301, name: "Team meeting", color: "#3174ad" },
      { id: 302, name: "Project deadline", color: "#3174ad" },
      { id: 303, name: "Client call", color: "#3174ad" },
    ],
  },
]

function GoalsSidebar({ onTodayClick, onCreateClick, onTaskDragStart }) {
  const currentMonthYear = moment().format("MMMM YYYY")
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [tasks, setTasks] = useState([])

  // When a goal is selected, update the tasks
  const handleGoalClick = (goal) => {
    setSelectedGoal(goal)
    setTasks(goal.tasks || [])
  }

  // Handle drag start for tasks
  const handleTaskDragStart = (e, task) => {
    // Set the data to be transferred
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        type: "task",
        id: task.id,
        name: task.name,
        color: task.color,
      }),
    )

    // Call the parent handler if provided
    if (onTaskDragStart) {
      onTaskDragStart(task)
    }
  }

  return (
    <div className="app-sidebar">
      <h2 className="sidebar-header">Calendar</h2>

      <div className="sidebar-actions">
        <button className="sidebar-button primary" onClick={onCreateClick}>
          Create Event
        </button>
        <button className="sidebar-button" onClick={onTodayClick}>
          Go to Today
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-month">{currentMonthYear}</h3>
      </div>

      {/* Goals Section */}
      <div className="sidebar-section">
        <h3 className="section-title">Goals</h3>
        <ul className="goals-list">
          {goalsData.map((goal) => (
            <li
              key={goal.id}
              className={`goal-item ${selectedGoal?.id === goal.id ? "selected" : ""}`}
              onClick={() => handleGoalClick(goal)}
              style={{ borderLeftColor: goal.color }}
            >
              {goal.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks Section - Only shown when a goal is selected */}
      {selectedGoal && (
        <div className="sidebar-section">
          <h3 className="section-title">Tasks for {selectedGoal.name}</h3>
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="task-item"
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task)}
                style={{ backgroundColor: task.color, color: "white" }}
              >
                {task.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-footer">
        <p>&copy; {moment().year()} My Calendar</p>
      </div>
    </div>
  )
}

export default GoalsSidebar
