@echo off

REM start the backend
start cmd /k "cd backend && npm install && npm start"

REM start React + Vite + Typescript frontend
start cmd /k "cd src/frontend && npm install && npm run dev"

pause