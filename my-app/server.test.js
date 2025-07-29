const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("./server"); // Import your Express app
const { assert } = require("console");
const { fail } = require("assert");

describe("POST /api/upload-audio", () => {
  const testAudioDir = path.join(__dirname, "public", "audio");

  beforeAll(() => {
    // Ensure test audio directory exists
    if (!fs.existsSync(testAudioDir)) {
      fs.mkdirSync(testAudioDir, { recursive: true });
    }
  });

  /*afterEach(() => {
    // Clean up test files after each test
    const files = fs.readdirSync(testAudioDir);
    files.forEach((file) => {
      if (file.startsWith("test-") || file.startsWith("recording-")) {
        const filePath = path.join(testAudioDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
  });*/

  test("should upload audio file successfully", async () => {
    const wavFilePath = path.join(__dirname, "test_data", "வேலை.wav");

    console.log(wavFilePath);
    if (!fs.existsSync(wavFilePath)) {
      assert.fail("unable to find test file ");
    }

    const response = await request(app)
      .post("/api/upload-audio")
      .field("audioName", "வேலை.wav")
      .attach("audio", wavFilePath);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // match status code
    expect(response).toHaveProperty("status", 200);

    expect(response.body).toHaveProperty(
      "message",
      "Audio file uploaded successfully"
    );
    expect(response.body).toHaveProperty("filename");
    expect(response.body).toHaveProperty("path");
    expect(response.body.filename).toContain(".mp3");
  }, 20000);

  test("should return 400 if no file is uploaded", async () => {
    const response = await request(app).post("/api/upload-audio").expect(400);

    expect(response.body).toHaveProperty("error", "No audio file uploaded");
  });

  test("should handle file with custom filename", async () => {
    const audioBuffer = Buffer.from("fake audio data");
    const customFilename = "my-custom-audio.wav";

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("audio", audioBuffer, customFilename)
      .expect(200);

    expect(response.body.filename).toContain("my-custom-audio.mp3");
  });

  test("should handle multiple file uploads (should reject)", async () => {
    const audioBuffer1 = Buffer.from("fake audio data 1");
    const audioBuffer2 = Buffer.from("fake audio data 2");

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("audio", audioBuffer1, "test1.wav")
      .attach("audio", audioBuffer2, "test2.wav")
      .expect(400); // Should reject multiple files

    expect(response.body).toHaveProperty("error");
  });

  test("should handle large file upload", async () => {
    // Create a larger mock file (1MB)
    const largeBuffer = Buffer.alloc(1024 * 1024, "a");

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("audio", largeBuffer, "large-test.wav")
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Audio file uploaded successfully"
    );
  });

  test("should reject file that is too large", async () => {
    // Create a file larger than 10MB limit
    const tooLargeBuffer = Buffer.alloc(11 * 1024 * 1024, "a");

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("audio", tooLargeBuffer, "too-large.wav")
      .expect(413); // Payload too large

    expect(response.body).toHaveProperty("error");
  });

  test("should handle wrong field name", async () => {
    const audioBuffer = Buffer.from("fake audio data");

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("wrongFieldName", audioBuffer, "test.wav")
      .expect(400);

    expect(response.body).toHaveProperty("error", "No audio file uploaded");
  });

  test("should convert WAV to MP3 format", async () => {
    const audioBuffer = Buffer.from("fake wav data");

    const response = await request(app)
      .post("/api/upload-audio")
      .attach("audio", audioBuffer, "test-conversion.wav")
      .expect(200);

    // Check that the response indicates MP3 format
    expect(response.body.filename).toMatch(/\.mp3$/);
    expect(response.body.path).toMatch(/\.mp3$/);
  });
});

describe("GET /api/health", () => {
  test("should return server status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toHaveProperty("status", "Server is running");
  });
});
