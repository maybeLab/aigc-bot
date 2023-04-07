import { ReactElement, createContext, useReducer } from "react";
import type { Dispatch } from "react";

export type TMessageRoles = "system" | "user" | "assistant";

export interface IMsgData {
  id: string;
  conversation_id: string;
  content: string;
  role: TMessageRoles;
}

export enum EModifyType {
  UPSERT_CONTENT,
  UPDATE_THE_LAST,
  ADD,
  MULTI_ADD,
  CLEAR,
}

export const msgListContext = createContext<{
  messages: IMsgData[];
  dispatch: Dispatch<{
    type: EModifyType;
    payload: IMsgData | null | undefined;
  }>;
}>({
  messages: [],
  dispatch: () => {},
});

const reducer = (
  state: Array<IMsgData>,
  action: { type: EModifyType; payload: IMsgData }
) => {
  switch (action.type) {
    case EModifyType.MULTI_ADD:
      return state.concat(action.payload);
    case EModifyType.ADD:
      return state.concat([action.payload]);
    case EModifyType.CLEAR:
      return [];
    case EModifyType.UPSERT_CONTENT:
      // TODO: findIndexLast
      const index = state.findIndex((e) => e.id === action.payload.id);
      if (index === -1) {
        return [...state, action.payload];
      } else {
        return state.map((val, i) => (i === index ? action.payload : val));
      }
    case EModifyType.UPDATE_THE_LAST:
      return state.map((val, i) =>
        i === state.length - 1 ? action.payload : val
      );
    default:
      return state;
  }
};

export const MsgListProvider = ({ children }: { children: ReactElement }) => {
  const [messages, dispatch] = useReducer(reducer, []);

  return (
    // @ts-ignore
    <msgListContext.Provider value={{ messages, dispatch }}>
      {children}
    </msgListContext.Provider>
  );
};

export default msgListContext;
