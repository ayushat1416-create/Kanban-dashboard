# Kanban Task Board

This is a simple Kanban style task management application (similar to Trello).
The goal of this project is to manage tasks using drag and drop between
three columns: To Do, In Progress, and Done.

I built this as a mini project for my internship to practice React, Next.js,
and working with state management and UI interactions.

## Features

- Three columns: To Do, In Progress, Done  
- Drag and drop tasks between columns  
- Reorder tasks inside the same column  
- Add new tasks  
- Edit existing tasks  
- Delete tasks  
- Data is saved in browser localStorage  
- Clean and simple UI using Tailwind CSS  
- Subtle hover animations for a smoother UI 
## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- dnd-kit

## How to Run the Project

1. Clone the repository

```bash
git clone https://github.com/ayushat1416-create/Kanban-dashboard.git
cd Kanban-dashboard

2. Install dependencies

npm install


3. Start the development server

npm run dev


Then open:
http://localhost:3000

How It Works

The board state is stored in browser localStorage.
When the app loads:

If saved data exists, it loads from localStorage

Otherwise it loads default data from initialData.ts

This way tasks are not lost after refresh

Folder Structure
app/
  page.tsx

components/
  Board.tsx
  Column.tsx
  TaskCard.tsx

lib/
  initialData.ts
  storage.ts