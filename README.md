MediSIN
MediSIN is a satirical healthcare web application built with React. It features interactive components, dark humor, and engaging UI effects designed for entertainment.

Features
Theme Toggle: Switch between MediSIN and MediHUB modes

Anxiety Cursor: Interactive cursor that avoids UI elements

Panic Button: Triggers Shah Rukh Khan laugh with volume control

Thunder Mode: Alakh Pandey motivational audio with screen effects

Product Catalog: Browse satirical healthcare products

Shopping Cart: Add and manage items

Chat Interface: Interactive assistant chatbot

Responsive Design: Built with Tailwind CSS

Tech Stack
React 18

Vite

Tailwind CSS

React Router

Lucide React Icons

React Hot Toast

Getting Started
Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
Clone the repository

bash
git clone https://github.com/diiviikk5/medisin-hackathon.git
cd medisin-hackathon
Install dependencies

bash
npm install
Start development server

bash
npm run dev
Build for production

bash
npm run build
Project Structure
text
medisin-hackathon/
├── public/              # Static assets (audio, images)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AnxietyCursor.jsx
│   │   ├── PanicButton.jsx
│   │   ├── ThunderousMode.jsx
│   │   ├── MoeChat.jsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   └── ...
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
Scripts
npm run dev - Start development server
