const express = require("express");
const http = require("http");
const cors = require("cors");
const socketServer = require("./src/socketServer");

// Register Part:
// const express = require('express');
// const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./db/connection.js')

// const port = 5500;

// app.use(cors());
// End Register Part:

const { connectWithOpenAIApi } = require("./src/ai");
connectWithOpenAIApi();

const app = express();
app.use(express.json());

const server = http.createServer(app);
socketServer.registerSocketServer(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello server is working");
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`App started listening 👻 at port ${PORT}`);
});


//Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password, full_name, mobile } = req.body;

  //Hash the Password
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log(hashedPassword);

  const sql = 'INSERT INTO users (username, password, full_name, mobile) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, hashedPassword,full_name,mobile ], (err, result) => {
      if (err) {
          console.log("Error In Registration: " + err)
      } else {
          res.json({ message: "Registration successful" });
      }
  })
});


//Login Endpoint

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //Check if username and password are present
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and Password are Required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, result) => {
      if (err || result.length === 0) {
          console.log("Error Searching for username: " + err)
          res.status(404).json({ message: "No username found" })
      } else {
          //compare hashed password
          const match = await bcrypt.compare(password, result[0].password);
          if (match) {
              //create a jwt token
              const token = jwt.sign({ userId: result[0].id }, 'my_secret_key', { expiresIn: '1h' });
              res.json({ message: 'Login Successful', token })
          } else {
              res.status(401).json({ message: 'Invalid Password' })
          }
      }
  })
});


//Authentication Middleware using JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("Unextracted Token: " + token)

  if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
  }
  const extractedToken = token.split(' ')[1];
  console.log('Actual TOken: ' + extractedToken)

  try {
      // /verift and validate our token
      const decoded = jwt.verify(extractedToken, 'my_secret_key')
      req.userId = decoded.userId;
      next();

  } catch (err) {
      res.status(401).json({ message: "Invalid Token" })
  }
}

app.get('/chat', authenticate, (req, res)=>{
  const userId = req.userId;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result)=>{
      if (err || result.length === 0) {
          res.status(500).json({message: "Error Fetching Details"})
      }else{
          res.json({full_name: result[0].full_name});
      }
      // console.log(result)
  })
});
