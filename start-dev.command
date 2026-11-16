#!/bin/bash
# Double-click to run the portfolio locally at http://localhost:3000
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
npm run dev
