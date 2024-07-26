const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const mammoth = require("mammoth");

const { registerSocketServer } = require("./src/socketServer");
const { connectWithOpenAIApi } = require("./src/ai");
const db = require('./db/connection.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


connectWithOpenAIApi();

const app = express();

const server = http.createServer(app);


registerSocketServer(server);

app.use(cors());
app.use(express.json());

// تابع برای خواندن و تبدیل فایل .docx به متن
const readDocxFile = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value; // محتوای متنی فایل .docx
  } catch (err) {
    console.error("Error reading .docx file:", err);
    return null;
  }
};

app.get("/", async (req, res) => {
  console.log("Received request for /");
  res.send("Hello server is working");
});

app.get("/docx-content", async (req, res) => {
  console.log("Received request for /docx-content");
  const docxText = await readDocxFile("/Users/msirous/Downloads/Udemy - ChatGPT with React and OpenAI API 2023. Build your own App. 2023-5/8 - Working with OpenAI API/complete-code/server/src/StudentsLaws_Eng.docx");
  if (docxText) {
    console.log("Successfully read .docx file");
    res.send(docxText);
  } else {
    console.error("Failed to read .docx file");
    res.status(500).send("Failed to read .docx file");
  }
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

// END of the system.
app.get("/", (req, res) => {
  res.send("Hello server is working");
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`App started listening at port ${PORT}`);
});
