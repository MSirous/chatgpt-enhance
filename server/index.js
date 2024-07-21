const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const mammoth = require("mammoth");

const { registerSocketServer } = require("./src/socketServer");
const { connectWithOpenAIApi } = require("./src/ai");

connectWithOpenAIApi();

const app = express();
const server = http.createServer(app);

registerSocketServer(server);

app.use(cors());

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

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`App started listening at port ${PORT}`);
});
