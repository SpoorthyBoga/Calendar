import React from 'react';
import moment from 'moment';
import './Toolbar.css'; // We'll create this CSS file

// Define view names mapping for buttons
const viewNames = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda'
};

function Toolbar({ date, view, views, label, onNavigate, onViewChange }) {

    const navigate = (action) => {
        onNavigate(action); // Pass standard 'PREV', 'NEXT', 'TODAY' actions
    };

    const handleViewChange = (newView) => {
        onViewChange(newView);
    };

    return (
        <div className="rbc-toolbar">
            {/* Date Navigation Buttons */}
            <div className="rbc-btn-group">
                <button type="button" onClick={() => navigate('TODAY')}>
                    Today
                </button>
                <button type="button" onClick={() => navigate('PREV')} aria-label="Previous">
                    &lt; {/* Left arrow */}
                </button>
                <button type="button" onClick={() => navigate('NEXT')} aria-label="Next">
                    &gt; {/* Right arrow */}
                </button>
            </div>

            {/* Current Date Label */}
            <div className="rbc-toolbar-label">
                {label} {/* Display the formatted date range */}
            </div>

            {/* View Switching Buttons */}
            <div className="rbc-btn-group">
                {views.map(viewName => (
                    <button
                        key={viewName}
                        type="button"
                        onClick={() => handleViewChange(viewName)}
                        className={view === viewName ? 'rbc-active' : ''}
                    >
                        {viewNames[viewName]} {/* Use mapped label */}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Toolbar;