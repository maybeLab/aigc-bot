import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { useParams } from "react-router-dom";

import TextInput from "@/components/textInput";

import showdown from "showdown";

import { askAI, API_ASK_AI } from "@/fetch/api";

import "./index.scss";
// import MsgItem from "../msgItem";

enum EMSG_SENDER_ROLE {
  MYSELF = 1,
  BOT = 2,
}

const tipCont: any = {
  speak: {
    "zn-CN": "请对着麦克风说话(中文)",
    "en-US": "speak english into your microphone...",
  },
  waiting: {
    "zn-CN": "GPT思考中,请稍等",
    "en-US": "GPT is thinking...",
  },
};

function Main() {
  let { conversationId } = useParams();

  const msgListRef: any = useRef();

  const [tip, setTip] = useState<string>("");

  const [converter, setConverter] = useState<any>();
  useEffect(() => {
    let converter = new showdown.Converter();
    setConverter(converter);
  }, []);

  // const addMessage = useCallback(
  //   (type: number, msg: string) => {
  //     dispatch({ type: "ADD", payload: { type, msg } });
  //     scrollToBottom();
  //   },
  //   [dispatch]
  // );

  const wsSend = useCallback((content: string) => {
    if (!content || !conversationId) return;
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
    API_ASK_AI({ content, conversationId });
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
  }, []);

  // user send msg
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text) return;
      wsSend(text);
    },
    [wsSend]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }, 10);
  };

  return (
    <div className="Container" ref={msgListRef}>
      {conversationId}
      {/* 消息列表 */}
      {/* {msgList.map((item: any, index: number) => (
        <MsgItem key={index} {...item}></MsgItem>
      ))} */}

      {tip && <div className="systemTip">{tip}</div>}

      {/* 信息输入框 */}
      <TextInput handleSendMessage={handleSendMessage} />
    </div>
  );
}

export default memo(Main);
