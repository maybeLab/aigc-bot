import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import showdown from "showdown";

import TextInput from "@/components/textInput";

import { API_ASK_AI, getMessages } from "@/fetch/api";
import { formatEventMessage } from "@/utils/message";

import msgListContext, {
  EModifyType,
  TMessageRoles,
  IMsgData,
} from "@/context/messageList";

import "./index.scss";
import MsgItem from "../msgItem";

function Main() {
  let { conversationId } = useParams();
  const msgListRef: any = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const { messages, dispatch } = useContext(msgListContext);

  const [tip, setTip] = useState<string>("");

  const [converter, setConverter] = useState<any>();

  useEffect(() => {
    getMessages({
      conversationId: conversationId as string,
    }).then((data) => {
      dispatch({ type: EModifyType.CLEAR, payload: null });
      dispatch({ type: EModifyType.MULTI_ADD, payload: data });
    });
  }, [conversationId, dispatch]);

  useEffect(() => {
    let converter = new showdown.Converter();
    setConverter(converter);
  }, []);

  const wsSend = useCallback(
    (content: string) => {
      // if (data.type === 101) {
      //   // addMessage(1, data.content);
      //   let locale: string = window._GLOBAL_SETTINGS.locale;
      //   let tip: string = tipCont.waiting[locale];
      //   setTip(tip);
      // }
      // let answer = "";
      // dispatch({
      //   type: "ADD",
      //   payload: { type: EMSG_SENDER_ROLE.BOT, msg: answer },
      // });
      // askAI({ content, conversationId }, (str, done) => {
      // setTip("");
      // answer += str;
      // let answerHtml = converter.makeHtml(answer);
      // dispatch({
      //   type: "UPDATE_THE_LAST",
      //   payload: {
      //     type: EMSG_SENDER_ROLE.BOT,
      //     msg: answerHtml,
      //     startAutoSpeech: done,
      //   },
      // });
      // scrollToBottom();
      // });
    },
    [conversationId]
  );

  // user send msg
  const handleSendMessage = useCallback(
    (content: string, callback: () => void) => {
      if (!content || !conversationId) return;
      API_ASK_AI({ content, conversationId })
        .then(async (res) => {
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
            const { index, ...message } = formatEventMessage(
              String.fromCharCode.apply(null, msg)
            );
            if (index === 0) {
              dispatch({ type: EModifyType.ADD, payload: message });
            } else {
              dispatch({ type: EModifyType.UPSERT_CONTENT, payload: message });
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(err.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          });
        });
    },
    [conversationId, dispatch, enqueueSnackbar]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }, 10);
  };

  return (
    <div className="Container" ref={msgListRef}>
      {/* 消息列表 */}
      {messages.map((item: IMsgData) => (
        <MsgItem
          key={item.id}
          type={item.role}
          content={item.content}
        ></MsgItem>
      ))}

      {tip && <div className="systemTip">{tip}</div>}

      {/* 信息输入框 */}
      <TextInput handleSendMessage={handleSendMessage} />
    </div>
  );
}

export default memo(Main);
