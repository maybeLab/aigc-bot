import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useContext,
} from "react";
import Fab from "@mui/material/Fab";
import BugReportIcon from "@mui/icons-material/BugReport";
import List from "@mui/material/List";

import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import showdown from "showdown";

import TextInput from "@/components/textInput";

import { API_ASK_AI, getMessages } from "@/fetch/api";
import { formatEventMessage } from "@/utils/message";

import Store from "@/context";
import { IMsgData, EModifyType } from "@/types";

import "./index.scss";
import MsgItem from "../msgItem";

function Main() {
  let { conversationId } = useParams();
  const msgListRef: any = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);

  const [tip, setTip] = useState<string>("");

  const [converter, setConverter] = useState<any>();

  useEffect(() => {
    getMessages({
      conversationId: conversationId as string,
    }).then((data) => {
      dispatch({ type: EModifyType.CLEAR_MESSAGE, payload: null });
      dispatch({ type: EModifyType.MULTI_ADD_MESSAGE, payload: data });
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
                  dispatch({ type: EModifyType.ADD_MESSAGE, payload: message });
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
    [conversationId, dispatch, enqueueSnackbar]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }, 10);
  };

  const mockSubmit = React.useCallback(() => {
    handleSendMessage("你好", () => {});
  }, [handleSendMessage]);

  return (
    <div className="Container" ref={msgListRef}>
      {/* 消息列表 */}
      <List
        sx={{
          width: "100%",
          height: "100%",
          pb: 7,
          overflow: "auto",
          bgcolor: "background.paper",
        }}
      >
        {state.messages.map((item: IMsgData) => (
          <MsgItem
            key={item.id}
            type={item.role}
            content={item.content}
          ></MsgItem>
        ))}
      </List>

      {tip && <div className="systemTip">{tip}</div>}

      {/* 信息输入框 */}
      <TextInput handleSendMessage={handleSendMessage} />
      <Fab
        aria-label="Microphone"
        color="primary"
        onClick={mockSubmit}
        sx={{
          position: "absolute",
          bottom: 100,
          right: 20,
          margin: "auto",
        }}
      >
        <BugReportIcon />
      </Fab>
    </div>
  );
}

export default memo(Main);
