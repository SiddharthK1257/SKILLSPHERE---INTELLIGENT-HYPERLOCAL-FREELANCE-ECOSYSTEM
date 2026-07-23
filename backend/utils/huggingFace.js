import axios from "axios";

const API_URL = `https://router.huggingface.co/hf-inference/models/${process.env.HF_MODEL}`;

export const getEmbedding = async (text) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        inputs: text,
        options: {
          wait_for_model: true,
          use_cache: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.log("=========== HF ERROR ===========");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    return null;
  }
};