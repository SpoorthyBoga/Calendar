
# Calendar App 🗓️

A full-stack calendar web application similar to Google Calendar. Users can create, drag-and-drop, resize, and delete events. The app supports goal-task scheduling by allowing tasks to be dragged from a goal list onto the calendar.


## 🚀 Features

- 📝 Create, update, and delete calendar events.
- 📆 Drag-and-drop event scheduling.
- 🔄 Resize events on the calendar.
- 🎯 Drag tasks from goals list to create events.
- 🌗 Dark and light mode toggle.
- 📡 RESTful API integration for full CRUD operations.
- 🧠 State management with Redux.

---

## 🛠️ Technologies Used

### Frontend (React)
- React.js
- Redux Toolkit
- FullCalendar (for calendar UI and drag-drop support)
- Tailwind CSS + DaisyUI
- CRACO (for custom CRA configuration)

### Backend (Node.js / Express)
- Node.js
- Express.js
- MongoDB (assumed from common stack usage)

---

## 📁 Folder Structure

```
Calendar/
├── client/                   # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI components like CalendarView, Sidebar, etc.
│   │   ├── redux/            # Redux store, slices
│   │   ├── pages/            # Page components (e.g., Home, Dashboard)
│   │   ├── App.js
│   │   ├── index.js
│   ├── craco.config.js
│   ├── package.json
│   └── .env
├── server/                   # Backend API (assumed)
│   ├── routes/               # Express routes
│   ├── controllers/          # Logic for handling routes
│   ├── models/               # MongoDB models/schemas
│   ├── server.js
├── package.json              # Backend dependencies
└── README.md
```

---

## 🧩 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/calendar-app.git
cd Calendar
```

### 2. Install dependencies

#### Backend

```bash
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Environment Setup

Create a `.env` file in both root and `client/` if needed. For example:

**Backend `.env`:**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

**Client `.env`:**

```
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run the App

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
cd client
npm start
```

Now, navigate to `http://localhost:3000` in your browser.

---

## 📌 Future Improvements

- User authentication with JWT
- Google Calendar sync
- Recurring events support
- Notification system

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📬 Contact

Made with ❤️ by Spoorthy


 
