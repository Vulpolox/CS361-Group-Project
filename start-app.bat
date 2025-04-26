@echo off

REM start the backend
start cmd /k "cd backend && npm start"

REM start React + Vite + Typescript frontend
start cmd /k "cd frontend && npm run dev"