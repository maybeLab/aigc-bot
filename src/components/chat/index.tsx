import React, { useRef, memo, useCallback, useContext } from "react";

import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import TextInput from "@/components/textInput";
import Messages from "./messages";

import { API_ASK_AI } from "@/fetch/api";
import { formatEventMessage } from "@/utils/message";

import Store from "@/context";
import { EModifyType } from "@/types";

import "./index.scss";

const DEFAULT_PREVIOUSLY_CONTENTS_LENGTH = 4;

function Main() {
  let { conversationId } = useParams();
  const msgListRef: any = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);

  // user send msg
  const handleSendMessage = useCallback(
    (content: string, callback: () => void) => {
      if (!content || !conversationId) return;

      const previouslyContents = state.messages
        .slice(-DEFAULT_PREVIOUSLY_CONTENTS_LENGTH)
        .map(({ content, role }) => ({ content, role }));

      API_ASK_AI({ content, conversationId, previouslyContents })
        .then(async (res) => {
          const decoder = new TextDecoder("utf-8");
          if (!res.body) {
            throw new Error("no body");
          }
          callback();
          const reader = res.body.getReader();

          const generator = {
            [Symbol.asyncIterator]() {
              return {
                next() {
                  return reader.read().catch(() => reader.releaseLock());
                },
              };
            },
          };

          for await (const msg of generator) {
            const str = decoder.decode(msg);
            str
              .split("\n\n")
              .filter((line: string) => line.trim() !== "")
              .forEach((line: string) => {
                const { index, ...message } = formatEventMessage(line);
                if (index === 0) {
                  dispatch({
                    type: EModifyType.PUSH_MESSAGE,
                    payload: message,
                  });
                } else {
                  dispatch({
                    type: EModifyType.UPSERT_CONTENT_MESSAGE,
                    payload: message,
                  });
                }
              });
          }
        })
        .catch((err) => {
          enqueueSnackbar(err.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          });
        });
    },
    [conversationId, dispatch, enqueueSnackbar, state.messages]
  );

  return (
    <div className="Container" ref={msgListRef}>
      {/* 消息列表 */}
      <Messages conversationId={conversationId} />

      {/* 信息输入框 */}
      <TextInput handleSendMessage={handleSendMessage} />
    </div>
  );
}

export default memo(Main);
