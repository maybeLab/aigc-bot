import { useEffect, memo } from "react";
import "./index.scss";
import speak from "./tts";

function MsgItemBot(props: any) {
  const textToSpeech = (text: string) => {
    speak(text);
  };

  useEffect(() => {
    props.startAutoSpeech === true && textToSpeech(props.content);
  }, [props]);

  return (
    <div className="msgItemBot">
      <div className="avatar">
        <img
          src="https://img95.699pic.com/element/40134/9088.png_300.png"
          alt=""
        />
      </div>
      <div className="msg">
        {props.startAutoSpeech && (
          <i
            className="voiceIcon iconfont icon-speak"
            onClick={() => {
              textToSpeech(props.content);
            }}
          ></i>
        )}
        <p dangerouslySetInnerHTML={{ __html: props.content }}></p>
      </div>
    </div>
  );
}

export default memo(MsgItemBot);
