import React from 'react';
import moment from 'moment'; // For displaying current month/year
import './Sidebar.css'; // We'll create this CSS file

// Basic Sidebar Structure - Can be expanded later
function Sidebar({ onTodayClick, onCreateClick }) {
    const currentMonthYear = moment().format('MMMM YYYY');

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
                {/* Placeholder for a mini-calendar or upcoming events */}
                <h3 className="sidebar-month">{currentMonthYear}</h3>
                {/* <MiniCalendar /> */}
                {/* <UpcomingEvents /> */}
                <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>(Future content area)</p>
            </div>

             {/* Optional: Add other links/sections */}
            {/* <div className="sidebar-section">
                 <h4>Settings</h4>
                 <a href="#settings">Account</a>
                 <a href="#settings">Preferences</a>
             </div> */}

             <div className="sidebar-footer">
                 {/* Info or links */}
                 <p>&copy; {moment().year()} Your Calendar</p>
             </div>
        </div>
    );
}

export default Sidebar;