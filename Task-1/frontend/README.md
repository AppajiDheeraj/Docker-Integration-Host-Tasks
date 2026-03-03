# Todo Frontend

React + Vite + Tailwind CSS frontend for the Todo API.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure API URL:**
Edit `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

3. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Features

- ✅ Display all todos from backend API
- ✅ Create new todos
- ✅ Edit existing todos
- ✅ Delete todos
- ✅ Toggle todo status (pending/completed)
- ✅ Filter by status (All, Pending, Completed)
- ✅ Professional UI with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Configurable API URL via environment variables

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx    # Form to add new todos
│   │   └── TodoItem.jsx    # Individual todo item with edit/delete
│   ├── api.js              # API service layer
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                    # Environment variables
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Preview Production Build

```bash
npm run preview
```
