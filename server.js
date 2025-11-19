// Simple Express server to store bookings and reviews to JSON files (demo).
// Usage: npm install express cors body-parser
// then: node server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve frontend files

const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

function readJson(file, fallback){
  try{
    if(fs.existsSync(file)){
      const txt = fs.readFileSync(file,'utf8');
      return JSON.parse(txt || '[]');
    }
  }catch(e){ console.error(e) }
  return fallback || [];
}
function writeJson(file, data){
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// API endpoints
app.get('/api/bookings', (req,res)=>{
  res.json(readJson(BOOKINGS_FILE, []));
});
app.post('/api/bookings', (req,res)=>{
  const data = readJson(BOOKINGS_FILE, []);
  const item = Object.assign({id:Date.now()}, req.body);
  data.unshift(item);
  writeJson(BOOKINGS_FILE, data);
  res.status(201).json(item);
});

app.get('/api/reviews', (req,res)=>{
  res.json(readJson(REVIEWS_FILE, []));
});
app.post('/api/reviews', (req,res)=>{
  const data = readJson(REVIEWS_FILE, []);
  const item = Object.assign({id:Date.now()}, req.body);
  data.unshift(item);
  writeJson(REVIEWS_FILE, data);
  res.status(201).json(item);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server running on http://localhost:'+port));
