export type TMessageRoles = "system" | "user" | "assistant";

export interface IMsgData {
  id: string;
  conversation_id: string;
  content: string;
  role: TMessageRoles;
}

export enum EModifyType {
  UPSERT_CONTENT_MESSAGE,
  UPDATE_THE_LAST_MESSAGE,
  PUSH_MESSAGE,
  MULTI_UNSHIFT_MESSAGE,
  CLEAR_MESSAGE,
  SET_CONVERSATION,
}

export interface IConversation {
  id: string;
  name: string;
  preset: string;
  update_at: string;
}

export type TPreviouslyContents = {
  role: TMessageRoles;
  content: string;
}[];
