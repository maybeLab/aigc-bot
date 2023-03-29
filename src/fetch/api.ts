import KeyvCache from "keyv-cache";

let userId = "";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/v1"
    : "https://larkbot.company.com/api/v1";
const COMMON_HEADERS = new Headers({
  authorization: userId,
});
COMMON_HEADERS.append("Content-Type", "application/json");

export const kvCaches = new KeyvCache({ namespace: "fe-tiya-bot" });
const USER_ID_KEY = "USER_ID";
const ONE_YEAR = 365 * 24 * 60 * 60 * 1e3;

export const API_CONVERSATION_ID = async (): Promise<{
  conversationId: string;
}> => ({ conversationId: "1" });
// fetch(`${ENDPOINT}/chat/conversation`, { method: "POST" })
//   .then((response) => response.json())
//   .then((res) => {
//     return res;
//   });

export const API_ASK_AI = (payload: {
  conversationId: string;
  content: string;
  needStream: boolean;
}) =>
  fetch(`${ENDPOINT}/chat/message`, {
    method: "POST",
    headers: COMMON_HEADERS,
    body: JSON.stringify(payload),
  });

export const getUserId = async () => {
  if (await kvCaches.has(USER_ID_KEY)) {
    return kvCaches.get(USER_ID_KEY);
  } else {
    const id = await API_CREATE_USER();
    userId = id;
    kvCaches.set(USER_ID_KEY, id, ONE_YEAR);
  }
};

export const API_CREATE_USER = async (): Promise<string> =>
  fetch(`${ENDPOINT}/user`, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `${response.url}\n${response.status}: ${response.statusText}`
      );
    })
    .then((res) => res.id);
