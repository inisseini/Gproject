import { text } from "@fortawesome/fontawesome-svg-core";
import fetch from "node-fetch";

const DiscordMessageSend = (type, message) => {
  /*const webhookUrl =
    "https://discord.com/api/webhooks/1156887494843973692/ejQif5hw-4V3xMzKq-HscflTrhZRiv0FtqtsVq0tK3c_l9mEKciOSKFzmAdY9m2A3m5H";*/
  const webhookUrl =
    type === "text"
      ? "https://discord.com/api/webhooks/1242044974556643339/qI-AsQ7IX-t4qzCls-NZpY9mPi-0zzR4xG8bB7mvXUV6D72aAkCw11GCL0CD6a5TahD-"
      : type === "mail"
      ? "https://discord.com/api/webhooks/1254917005409128619/EoK0eTulG4IqMnCDS5y7eDddyKYFtPhsnT2ib5z-1J_drCvencLPO2zWnDeXWDKmPVmM"
      : "https://discord.com/api/webhooks/1242045512027471943/l_QzWW1YpGaGz1ES44MdjNArMqHN10y5NL2fFGCPkODj_u5yeqVxAyzbND2j9CS6StS_";

  const requestBodyTxt = {
    content: "通知：" + message,
    username: "システムメッセージ",
    avatar_url: "https://example.com/path/to/img.png"
  };

  const requestBodyImg = {
    username: "システムメッセージ",
    avatar_url: "https://example.com/path/to/img.png",
    content: "画像がアップロードされました‼",
    embeds: [
      {
        thumbnail: {
          url: message
        }
      }
    ]
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: type === "img" ? JSON.stringify(requestBodyImg) : JSON.stringify(requestBodyTxt)
  })
    .then(response => {
      console.log(response.status);
      console.log(response.statusText);
    })
    .catch(error => {
      console.error("Error sending webhook:", error);
    });
};

export default DiscordMessageSend;
