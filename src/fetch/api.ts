import KeyvCache from "keyv-cache";
import { IForm as IConversationForm } from "@/components/conversations/add";
let userId = "";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/v1"
    : "https://larkbot.company.com/api/v1";

const getCommonHeaders = () => {
  return new Headers({
    Authorization: userId,
    "Content-Type": "application/json",
  });
};

export const kvCaches = new KeyvCache({ namespace: "fe-tiya-bot" });
const USER_ID_KEY = "USER_ID";
const ONE_YEAR = 365 * 24 * 60 * 60 * 1e3;

export const API_ASK_AI = (payload: {
  conversationId: string;
  content: string;
}) =>
  fetch(`${ENDPOINT}/chat/message`, {
    method: "POST",
    headers: getCommonHeaders(),
    body: JSON.stringify(payload),
    mode: "cors",
  });

export const getUserId = async () => {
  if (await kvCaches.has(USER_ID_KEY)) {
    return kvCaches.get(USER_ID_KEY).then((id: string) => (userId = id));
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

export interface IConversation {
  id: string;
  name: string;
  preset: string;
  create_at: string;
  update_at: string | null;
}

export const API_GET_CONVERSATIONS = async (): Promise<IConversation[]> =>
  fetch(`${ENDPOINT}/conversation`, {
    headers: getCommonHeaders(),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `${response.url}\n${response.status}: ${response.statusText}`
    );
  });

export const API_CREATE_CONVERSATION = async (
  data: IConversationForm
): Promise<IConversation> =>
  fetch(`${ENDPOINT}/conversation`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getCommonHeaders(),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `${response.url}\n${response.status}: ${response.statusText}`
    );
  });

export async function askAI(
  { content, conversationId }: { content: string; conversationId: string },
  callback: (answer: string, isDone: boolean) => void
) {
  try {
    API_ASK_AI({ conversationId, content }).then((response) => {
      if (!response?.body) return;
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          const pump: Function = () => {
            return reader.read().then(({ done, value }) => {
              if (controller.desiredSize !== 1) {
                callback(new TextDecoder().decode(value), done);
              }
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            });
          };
          return pump();
        },
      });
    });
  } catch (err) {
    console.log(`API ERROR: `, err);
  }
}
