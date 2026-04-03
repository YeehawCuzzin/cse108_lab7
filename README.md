# CSE 106 Lab 7 - Grades Web App (Flask + SQLAlchemy)

This project extends Lab 6 by adding a database layer using SQLAlchemy.
The application is a full-stack Flask web app that allows users to manage student grades with persistent storage.

# Features
- View all students and grades
- View a specific student's grade
- Add a new student
- Update an existing student's grade
- Delete a student

# Tech Stack
- Python (Flask)
- Flask-SQLAlchemy (ORM)
- SQLite (database)
- HTML, CSS, JavaScript (frontend)

# Project Structure
cse108_lab7/
│
├── app.py                # Flask backend + REST API + database logic
├── requirements.txt     # Python dependencies
│
├── templates/
│   └── index.html       # Frontend UI
│
├── static/
│   ├── script.js        # API calls and UI logic
│   └── styles.css       # Styling

# Setup Instructions
git clone https://github.com/YOUR_USERNAME/cse108_lab7.git
cd cse108_lab7

pip install -r requirements.txt

python app.py

# Open in browser
http://127.0.0.1:5000

# Notes
- The database file (grades.db) is created automatically when the app runs
- The database file is not included in the repository
- This app uses a development server (Flask debug mode)

# Summary
This lab demonstrates how to integrate a database into a Flask application using an ORM,
transitioning from in-memory storage to persistent data handling while maintaining the same REST API structure.
