import { IForm as IConversationForm } from "@/components/conversations/add";
import { IConversation, TPreviouslyContents } from "@/types";

const ENDPOINT = `${process.env.REACT_APP_MAIN_DOMAIN}/apis`;
const AUTH_ENDPOINT = `${process.env.REACT_APP_MAIN_DOMAIN}/auth`;

const redirectCatch = (err: Error) => {
  if (err.message.includes("401")) {
    return API_CREATE_USER().catch(() =>
      window.location.assign(
        `${AUTH_ENDPOINT}/login?redirect=${window.location.href}`
      )
    );
  }
};

export const API_AZURE_TOKEN = async (region: string) => {
  return (
    await fetch(`${ENDPOINT}/azure/getAzureSpeechToken?region=${region}`, {
      credentials: "include",
    })
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
  fetch(`${ENDPOINT}/aigc/chat/message?${query}`, {
    method: "GET",
    credentials: "include",
    redirect: "error",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `${response.url}\n${response.status}: ${response.statusText}`
      );
    })
    .catch(redirectCatch);

export const API_ASK_AI = async (payload: {
  conversationId: string;
  content: string;
  previouslyContents?: TPreviouslyContents;
}) =>
  fetch(`${ENDPOINT}/aigc/chat/message`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  })
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .catch(redirectCatch);

export const API_CREATE_USER = async (): Promise<void> =>
  fetch(`${ENDPOINT}/aigc/user`, {
    method: "POST",
    headers: await getCommonHeaders(),
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      return window.location.reload();
    }
    throw new Error(
      `${response.url}\n${response.status}: ${response.statusText}`
    );
  });

export const API_GET_CONVERSATIONS = async (): Promise<IConversation[]> =>
  fetch(`${ENDPOINT}/aigc/conversation`, {
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
    .catch(redirectCatch);

export const API_CREATE_CONVERSATION = async (
  data: IConversationForm
): Promise<IConversation> =>
  fetch(`${ENDPOINT}/aigc/conversation`, {
    method: "POST",
    body: JSON.stringify(data),
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
    .catch(redirectCatch);

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
