const express = require("express");
const fs = require("fs");
const mammoth = require("mammoth");

const app = express();

// Function to read and convert .docx file to text
const readDocxFile = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value; // The text content of the .docx file
  } catch (err) {
    console.error("Error reading .docx file:", err);
    return null;
  }
};

app.get("/", async (req, res) => {
  const docxText = await readDocxFile("./src/StudentsLaws_Eng.docx");
  if (docxText) {
    res.send(docxText);
  } else {
    res.status(500).send("Failed to read .docx file");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
