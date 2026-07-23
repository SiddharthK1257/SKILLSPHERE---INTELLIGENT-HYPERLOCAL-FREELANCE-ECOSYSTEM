import axios from "axios";

const API_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2";

export default async function semanticMatcher(userText, gigText) {
  try {
    const { data } = await axios.post(
      API_URL,
      {
        inputs: {
          source_sentence: userText,
          sentences: [gigText],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return Math.round(data[0] * 100);
  } catch (err) {
    console.log(err.response?.data || err.message);
    return 0;
  }
}