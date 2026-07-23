import axios from "axios";
import User from "../models/User.js";

export const generateProfileSummary = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const prompt = `
Create a professional profile summary.

Name: ${user.name}

Headline: ${user.headline}

Job Title: ${user.jobTitle}

Skills:
${user.skills.join(", ")}

Experience:
${user.experience} years

Education:
${user.education}

Location:
${user.location}

Return only the summary.
`;

    const response = await axios.post(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        model: process.env.HF_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        },
      }
    );

    res.json({
      success: true,
      summary:
        response.data.choices[0].message.content,
    });

  } catch (err) {
    console.log(err.response?.data);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};