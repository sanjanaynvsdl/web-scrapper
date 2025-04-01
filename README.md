
# 📺 SmartScrape 

A full-stack web application that scrapes detailed data from any **Amazon India Smart TV product link** and generates an **AI-powered summary** using **Gemini API**. It displays structured product details, customer reviews, specifications, bank offers, and all associated images — all neatly visualized in a responsive frontend.



## Features

- Scrapes Smart TV product data from Amazon.in using Puppeteer
- AI-generated summarized review sentiment (powered by Gemini API)
- Displays:
  - Product Title, Rating, Number of Ratings
  - Selling Price, Discount, and Bank Offers
  - "About this item" & full technical specifications
  - Product Images (including “From the Manufacturer” section)



##  Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Scraping     | Puppeteer (Headless Chrome) |
| AI Summary   | Gemini API (LLM by Google) |
| Backend      | Node.js, Express          |
| Frontend     | React, Vite, Tailwind CSS |
| Deployment   | Vercel / Render / Railway |


## Demo Video

[![Watch the Demo](https://img.shields.io/badge/Watch%20Demo-%230A66C2?style=for-the-badge)](https://drive.google.com/file/d/1oPRyAhuKKXfLTb4wfWYLm9B5nIb9XjxK/view?usp=drive_link)



## Project Structure

```
sanajanaynvsdl-linkedin/
├── server/         # Node.js API & scraper logic
│   ├── controllers/
│   ├── routes/
│   └── index.js
├── client/        # React app
│   ├── src/
│   ├── components/
│   └── App.jsx
└── utils/           # Utility files
```



## Installation

### 1. Clone the repo

```bash
git clone https://github.com/sanjanaynvsdl/web-scrapper.git
cd web-scrapper
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Environment Setup

### Backend `.env`

Inside `backend/.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend `.env`

Inside `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```



## Run the Application

### 1. Start Backend

```bash
cd backend
npm run dev
```

### 2. Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```



## Example Input

Paste any Amazon India Smart TV product link like:

```
https://www.amazon.in/TCL-inches-Metallic-Bezel-Less-65V6B/dp/B0CZ6VXCBN?th=1
```

