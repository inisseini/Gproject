import { text } from "@fortawesome/fontawesome-svg-core";
import fetch from "node-fetch";

const DiscordMessageSend = async (type, message) => {
  const lambdaUrl = "https://6hz75kvdbpmdad6rpprkli6mke0pjedk.lambda-url.ap-northeast-1.on.aws/";
  try {
    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, message })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
    } else {
      const error = await response.json();
      console.error("Error:", error.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export default DiscordMessageSend;
