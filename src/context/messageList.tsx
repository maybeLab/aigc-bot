import { ReactElement, createContext, useReducer } from "react";
import type { Dispatch } from 'react';

interface IMsgData { type: number, msg: string, startAutoSpeech?: boolean };
type TModifyType = 'UPDATE_THE_LAST' | 'ADD';

export const msgListContext = createContext<{
  msgList: IMsgData[],
  dispatch: Dispatch<{ type: TModifyType, payload: IMsgData }>
}>({
  msgList: [],
  dispatch: () => {}
});

const reducer = (state: Array<IMsgData>, action: { type: TModifyType, payload: IMsgData }) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE_THE_LAST':
      return state.map((val, i) => (i === state.length - 1 ? action.payload : val));
    default:
      return state;
  }
}

export const MsgListProvider = ({ children }: { children: ReactElement }) => {
  const [msgList, dispatch] = useReducer(reducer, [])

  return (
    <msgListContext.Provider value={{ msgList, dispatch }}>
      {children}
    </msgListContext.Provider>
  )
}

export default msgListContext;