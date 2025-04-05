@echo off

REM Start the main backend server
cd server
start /B python main.py

REM Start the sign language server
start /B python sign.py

REM Start the frontend server
cd ../client
npm run dev 