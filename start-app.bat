@echo off

REM start the backend
start cmd /k "cd api && node server.js"

REM start React + Vite + Typescript frontend
start cmd /k "cd src/frontend/src/components && npm run dev"