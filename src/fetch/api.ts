import { IForm as IConversationForm } from "@/components/conversations/add";
import { IConversation, TPreviouslyContents } from "@/types";

export const USER_ID_KEY = window.location.origin + "/USER_ID";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? `${window.location.protocol}//${window.location.hostname}:3000/api/v1`
    : window.location.hostname.includes("company")
    ? `${window.location.protocol}//larkbot.company.com/api/v1`
    : window.location.hostname.includes("out.company")
    ? `/api/v1`
    : "https://larkbot.company.com/api/v1";

export const API_AZURE_TOKEN = async (region: string) => {
  return (
    await fetch(
      `https://fetoolsout.company.com/office/getAzureSpeechToken?region=${region}`
    )
  )
    .json()
    .then((res) => {
      return res.token;
    });
};

const getCommonHeaders = async () => {
  return new Headers({
    "x-csrf-token": document.cookie
      .split(";")
      .map((e) => e.trim())
      .filter((e) => e.includes("csrfToken="))[0]
      ?.split("csrfToken=")[1],
    "Content-Type": "application/json",
  });
};

export const getMessages = async (query: string) =>
  fetch(`${ENDPOINT}/chat/message?${query}`, {
    method: "GET",
    headers: await getCommonHeaders(),
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `${response.url}\n${response.status}: ${response.statusText}`
    );
  });

export const API_ASK_AI = async (payload: {
  conversationId: string;
  content: string;
  previouslyContents?: TPreviouslyContents;
}) =>
  fetch(`${ENDPOINT}/chat/message`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  }).then((res) => (res.ok ? res : Promise.reject(res)));

export const getUserId = async () => {
  if (localStorage[USER_ID_KEY]) {
    return localStorage[USER_ID_KEY];
  } else {
    const id = await API_CREATE_USER();
    localStorage[USER_ID_KEY] = id;
  }
};

export const API_CREATE_USER = async (): Promise<string> =>
  fetch(`${ENDPOINT}/user`, {
    method: "POST",
    headers: await getCommonHeaders(),
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `${response.url}\n${response.status}: ${response.statusText}`
      );
    })
    .then((res) => res.id);

export const API_GET_CONVERSATIONS = async (): Promise<IConversation[]> =>
  fetch(`${ENDPOINT}/conversation`, {
    headers: await getCommonHeaders(),
    credentials: "include",
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
    headers: await getCommonHeaders(),
    credentials: "include",
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
