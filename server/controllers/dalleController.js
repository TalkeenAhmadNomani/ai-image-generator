import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Health check
// @route   GET /api/dalle
export const getDalleMessage = (req, res) => {
  res.status(200).json({ message: "Hello from DALL·E!" });
};

// @desc    Generate image from prompt
// @route   POST /api/dalle
export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({
      error:
        error?.error?.message ||
        "Something went wrong while generating the image",
    });
  }
};
