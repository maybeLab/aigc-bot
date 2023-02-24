import React, { useState, useEffect, useRef, memo, useCallback, useMemo, useContext } from 'react';
import classNames from 'classnames';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { getSpeechConfig } from './utils/speech';
import showdown from 'showdown'

import { API_CONVERSATION_ID, API_ASK_AI } from './fetch/api';

import msgListContext from './context/messageList';

import './App.scss';
import TopBar from './components/topBar';
import MsgItem from './components/msgItem';
import SettingDialog from './components/settingDialog';

enum EMSG_SENDER_ROLE {
  MYSELF = 1,
  BOT = 2
}

const tipCont: any = {
  speak: {
    'zn-CN': '请对着麦克风说话(中文)',
    'en-US': 'speak english into your microphone...'
  },
  waiting: {
    'zn-CN': 'GPT思考中,请稍等',
    'en-US': 'GPT is thinking...'
  }
}

const getSessionId = API_CONVERSATION_ID();

async function askAI(question: string, callback: (answer: string, isDone: boolean) => void) {
  try {
    const { id } = await getSessionId;
    API_ASK_AI({ needStream: true, id, message: question }).then(response => {
      if (!response?.body) return;
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          const pump: Function = () => {
            return reader.read().then(({ done, value }) => {
              if (controller.desiredSize !== 1) {
                callback(new TextDecoder().decode(value), done);
              }
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
          return pump();
        }
      });
    });
  } catch (err) {
    console.log(`API ERROR: `, err);
  }
}

function App() {
  console.log('App..')
  const { msgList, dispatch } = useContext(msgListContext);
  const [micState, setMicState] = useState(false)
  const [iptMsg, setIptMsg] = useState('')
  const msgListRef: any = useRef();
  const inputAreaRef = useRef<HTMLDivElement | null>();

  const [tip, setTip] = useState<string>('')

  const [converter, setConverter] = useState<any>()
  useEffect(()=>{
    let converter = new showdown.Converter();
    setConverter(converter)
  },[])

  const clearInputArea = useCallback((blur = false) => {
    (inputAreaRef.current as HTMLDivElement).innerText = "";
    blur && (inputAreaRef.current as HTMLDivElement).blur()
  }, []);

  const addMessage = useCallback((type: number, msg: string) => {
    dispatch({ type: 'ADD', payload: { type, msg } });
    scrollToBottom()
  },[dispatch])

  const wsSend = useCallback((data: { type: number, message: string }) => {
    if (!data.type || !data.message) return;
    if (data.type === 101) {
      addMessage(1, data.message)
      let locale: string = window._GLOBAL_SETTINGS.locale;
      let tip: string = tipCont.waiting[locale]
      setTip(tip)
    }
    clearInputArea(true);
    let answer = '';
    dispatch({ type: 'ADD', payload: { type: EMSG_SENDER_ROLE.BOT, msg: answer } });
    askAI(data.message, (str, done) => {
      setTip('')
      answer += str;
      let answerHtml = converter.makeHtml(answer);
      dispatch({ type: 'UPDATE_THE_LAST', payload: { type: EMSG_SENDER_ROLE.BOT, msg: answerHtml, startAutoSpeech: done } });
      scrollToBottom()
    });
  },[addMessage, clearInputArea, converter, dispatch])

  const recognizerRef: any = useRef();
  const sttFromMic = useCallback(async () => {
    console.log('sttFromMix', micState)
    if (micState === true) {
      console.log('micState is ture, stop recognize')
      recognizerRef.current.stopContinuousRecognitionAsync();
      setMicState(false)
      return
    }
    const speechConfig = await getSpeechConfig();
    speechConfig.speechRecognitionLanguage = window._GLOBAL_SETTINGS.locale;
    const audioConfig = SpeechSDK.AudioConfig.fromMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizerRef.current = recognizer
    setMicState(true)

    setTip(tipCont.speak[window._GLOBAL_SETTINGS.locale]);

    recognizer.recognizeOnceAsync(result => {
      let displayText;
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        displayText = result.text;
        console.log('speech text:', displayText)
        setMicState(false)
        wsSend({ type: 101, message: displayText });
      } else {
        displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        setMicState(false)
        setTip('')
        alert(displayText)
      }
    })
  }, [micState, wsSend])

  // user send msg
  const handleSendMessage = useCallback(() => {
    if (!iptMsg) return
    wsSend({ type: 101, message: iptMsg })
  },[iptMsg, wsSend])

  // simulate bot send msg
  const botSendMsg = (botMsg: string) => {
    if (!botMsg) return
    // addMessage(2, botMsg);
  }

  const [settingDialog, setSettingDialog] = useState(false)
  const handleSetting = () => {
    console.log('click setting btn..')
    setSettingDialog(!settingDialog)
  }
  const scrollToBottom = () => {
    setTimeout(() => {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }, 10)
  }

  const onPaste = useCallback((event: React.ClipboardEvent) => {
    event.preventDefault();
    let pasteText = event.clipboardData?.getData("text").trim();
    document.execCommand("insertText", false, pasteText);
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.code === "Enter" || event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          document.execCommand("insertText", false, "\n");
        } else {
          handleSendMessage()
        }
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIptMsg((inputAreaRef.current as HTMLDivElement).innerText);
    });
    observer.observe(inputAreaRef.current as HTMLDivElement, {
      characterData: true,
      subtree: true,
      childList: true,
    });
  }, []);

  return (
    <div className="App">
      <div className='Container' ref={msgListRef}>
        {/* topBar */}
        <TopBar title='AIGC-BOT' settingFn={handleSetting}></TopBar>

        {/* 消息列表 */}
        {msgList.map((item: any, index: number) => <MsgItem key={index} {...item}></MsgItem>)}

        {tip && (<div className="systemTip">
          {tip}
        </div>)}

        {/* 信息输入框 */}
        <div className='inputBox'>
        <div
          className="ipt"
          contentEditable={true}
          ref={(ref) => (inputAreaRef.current = ref)}
          onPasteCapture={onPaste}
          onKeyDownCapture={onKeyDown}
        ></div>
          <div className='btnSend' onClick={handleSendMessage}><span className='text'>send</span></div>
        </div>

        <div className='btnVoice' onClick={sttFromMic}>
          <i className={classNames("iconfont", "icon-voice", "scale", { "greenColor": micState })}></i>
        </div>

        <section style={{ display: settingDialog ? 'block' : 'none' }}>
          <SettingDialog simulateBotSendMsgFn={botSendMsg}></SettingDialog>
        </section>

      </div>
    </div>
  );
}

export default memo(App);
