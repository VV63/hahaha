const express = require('express');
const path = require('path'); 
const sqlite3 = require('sqlite3').verbose(); 

const app = express();
const port = 3000;  

app.use(express.json());

const dbPath = path.join(__dirname, 'user.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {

    db.run(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant TEXT,
      meal TEXT,
      pickupTime TEXT,
      pickupLocation TEXT,
      paymentMethod TEXT,
      cutlery TEXT,
      studentID INTEGER
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  }
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM user', (err, rows) => {
    if (err) {
      console.error('Error querying SQLite:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ users: rows });
    }
  });
});

app.post('/addUser', (req, res) => {
  const newUser = req.body;  

  
  const query = 'INSERT INTO user (restaurant, meal, pickupTime, pickupLocation, paymentMethod, cutlery, studentID) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [newUser.restaurant, newUser.meal, newUser.pickupTime, newUser.pickupLocation, newUser.paymentMethod, newUser.cutlery, newUser.studentID];


  db.run(query, values, function(err) {
    if (err) {
      console.error('Error adding user to SQLite:', err);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    } else {
      res.json({ success: true, message: 'User added successfully.', id: this.lastID });
    }
  });
});

process.on('exit', () => {
  db.close(); 
  console.log('SQLite connection closed');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});