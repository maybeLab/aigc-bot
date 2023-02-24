const ENDPOINT = `${process.env.REACT_APP_MAIN_DOMAIN}/apis`;

const DEFAULT_HEADERS = new Headers();
DEFAULT_HEADERS.append('Content-Type', 'application/json');


export const API_CONVERSATION_ID = (): Promise<{ id: string; code: number }> => fetch(`${ENDPOINT}/chat/conversations-id`, { method: 'POST' }).then(response => response.json());

export const API_ASK_AI = (payload: { id: string, message: string, needStream: boolean }) => fetch(`${ENDPOINT}/chat/openai`, {
  method: 'POST',
  headers: DEFAULT_HEADERS,
  body: JSON.stringify(payload)
});
