# Quiz App 🎯

A modern quiz application built with **React**.  
It supports:
- Multiple choice questions fron local JSON file storage.
- Countdown timer per question (answers lock when time runs out).
- Skip / Previous / Next navigation.
- Result screen with detailed feedback and best score tracking (localStorage).
- Progress bar that updates as you answer.

---

## 🚀 Getting Started

Follow these steps to run the app on your machine:

### 1. Clone this repository

git clone https://github.com/viveksingh2005/quiz-app.git
cd quiz-app

### 2. Install dependencies

Make sure you have Node.js (>=14) and npm installed.
Then run:
npm install

### 3. Start the development server

npm start

### 4. Build for production

To create an optimized production build:

npm run build

📁 Project Structure


```bash
quiz-app/
├── public/
│   ├── index.html
│   └── questions.json   # fallback local questions
├── src/
│   ├── pages/
│   │   ├── Quiz.jsx     # quiz logic with timer
│   │   └── Results.jsx  # results summary
│   ├── shared/
│   │   └── QuestionCard.jsx
│   ├── App.js           # main app + routing
│   ├── index.js         # React entry point
│   └── index.css        # styles
└── README.md
