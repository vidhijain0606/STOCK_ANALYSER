Stock Portfolio Watchlist
A full-stack web application that allows users to track and analyze their favorite stocks through a personalized watchlist.
The application integrates a Flask backend with a React + Vite frontend and uses TailwindCSS and ShadCN for styling.

Features

User authentication with secure login and registration
Watchlist management (add, remove, and view favorite stocks)
Real-time stock lookup and company information
Historical stock price analysis and trend visualization
Modern and responsive user interface
RESTful API integration between frontend and backend

Tech Stack
Frontend:React (Vite), TypeScript, TailwindCSS, ShadCN UI, Lucide Icons
Backend:Python, Flask, Flask-CORS, Flask-SQLAlchemy
Database:MySQL
APIs:Custom REST API for stock and user management
Tools:Git, VS Code, Python Virtual Environment (venv)

Setup Instructions
1. Clone the Repository
git clone https://github.com/vidhijain0606/STOCK_ANALYSER
cd stock-portfolio-watchlist
2. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate      # For Windows
# source venv/bin/activate  # For macOS/Linux
pip install -r requirements.txt
python run.py
Backend runs at:
http://127.0.0.1:5000
3. Frontend Setup
cd frontend
npm install
npm run dev
Frontend runs at:
http://localhost:5173

4. Connect Frontend and Backend
The frontend communicates with the Flask backend via REST API endpoints such as /login, /watchlist, and /watchlist/add.
If the backend is running on a different port, update the base URL inside:
frontend/src/config/api.ts
Project Structure
Stock-Portfolio-Watchlist/
│
├── backend/
│   ├── project/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── stocks.py
│   │   ├── services/
│   │   │   └── api_service.py
│   ├── instance/
│   ├── run.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Login.tsx
│   │   ├── components/
│   │   │   ├── WatchlistTable.tsx
│   │   │   └── AddStockDialog.tsx
│   ├── index.html
│   ├── vite.config.ts
├── README.md
└── .gitignore

Future Enhancements
Historical stock price visualization with charts
Stock performance analytics
Dark mode and UI customization
Email notifications or stock alerts

Author
Vidhi Jain
AI and Web Development Enthusiast
Email:vidhijj0606@gmail.com
GitHub: https://github.com/vidhijain0606

License
This project is licensed under the MIT License.
You are free to use, modify, and distribute this software in compliance with the license terms.
