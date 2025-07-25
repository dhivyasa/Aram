const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;
const ffmpeg = require("fluent-ffmpeg");

// Enable CORS for your React app
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true,
  })
);

// Ensure the audio directory exists
const audioDir = path.join(__dirname, "public", "audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir); // Save to public/audio folder
  },
  filename: (req, file, cb) => {
    // Use the original filename or generate a new one
    console.log("req.file", file);
    const filename = file.originalname || `recording-${Date.now()}.wav`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload endpoint
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  console.log("request is req", req.file.originalname);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    console.log("Audio file saved:", req.file.filename);

    // convert the file from wav to mp3
    // const inputPath = `public/audio/${req.file.filename}.wav`;
    const inputPath = path.join(
      __dirname,
      "public",
      "audio",
      req.file.filename
    );
    console.log("input path", inputPath);

    const outputPath = inputPath.replace(".wav", ".mp3");
    console.log("output path", outputPath);

    ffmpeg(inputPath).toFormat("mp3").save(outputPath);
    

    res.json({
      message: "Audio file uploaded successfully",
      filename: outputPath,
      path: outputPath,
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    res.status(500).json({ error: "Failed to upload audio file" });
  }
});

// Serve static files from public directory
app.use("/audio", express.static(audioDir));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Only start server if this file is run directly (not during testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Audio files will be saved to: ${audioDir}`);
  });
}

// Export app for testing
module.exports = app;
