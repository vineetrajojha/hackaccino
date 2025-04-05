#!/bin/bash

# Start the main backend server
cd server
python main.py &

# Start the sign language server
python sign.py &

# Start the frontend server
cd ../client
npm run dev 