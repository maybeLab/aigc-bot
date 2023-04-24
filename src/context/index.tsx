import React, { ReactElement, useReducer } from "react";
import { IMsgData, EModifyType, IConversation } from "@/types";

export type TState = {
  conversation: IConversation;
  conversations: IConversation[];
  messages: IMsgData[];
};

export interface TAction {
  type: EModifyType;
  payload: any;
}

export interface TContextProps {
  state: TState;
  dispatch: React.Dispatch<TAction>;
}

export const initialState = {
  conversation: {
    id: "",
    name: "",
    preset: "",
    update_at: "",
  },
  conversations: [],
  messages: [],
};

const reducer: React.Reducer<TState, TAction> = function (
  state: TState,
  action: { type: EModifyType; payload: any }
) {
  switch (action.type) {
    case EModifyType.SET_PAYLOAD:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case EModifyType.PUSH_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.concat([action.payload]),
      };
    case EModifyType.SET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload,
      };
    case EModifyType.MULTI_UNSHIFT_MESSAGE:
      return {
        ...state,
        messages: action.payload.concat(state.messages),
      };
    case EModifyType.PUSH_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat([action.payload]),
      };
    case EModifyType.CLEAR_MESSAGE:
      return {
        ...state,
        messages: [],
      };
    case EModifyType.UPSERT_CONTENT_MESSAGE:
      let messages = state.messages;
      // TODO: findIndexLast
      const index = state.messages.findIndex((e) => e.id === action.payload.id);
      if (index === -1) {
        messages = [...messages, action.payload];
      } else {
        messages = messages.map((val, i) =>
          i === index ? action.payload : val
        );
      }
      return {
        ...state,
        messages,
      };
    case EModifyType.UPDATE_THE_LAST_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((val, i) =>
          i === state.messages.length - 1 ? action.payload : val
        ),
      };
    default:
      return state;
  }
};

// @ts-ignore
const Store = React.createContext({} as TContextProps);

export const StoreProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer<React.Reducer<TState, TAction>>(
    reducer,
    initialState
  );

  return (
    <Store.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export default Store;
