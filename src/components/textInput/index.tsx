import React from "react";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import Zoom from "@mui/material/Zoom";

import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { getSpeechConfig } from "@/utils/speech";

export default React.memo(function TextInput({ handleSendMessage }: any) {
  const inputAreaRef = React.useRef<HTMLDivElement | null>();
  const [tip, setTip] = React.useState("");
  const [text, setText] = React.useState("");
  const [isFocus, setFocusState] = React.useState(false);

  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const recognizerRef: any = React.useRef();
  const [micState, setMicState] = React.useState(false);

  const sttFromMic = React.useCallback(async () => {
    console.log("sttFromMix", micState);
    if (micState === true) {
      console.log("micState is ture, stop recognize");
      recognizerRef.current.stopContinuousRecognitionAsync();
      setMicState(false);
      return;
    }
    const speechConfig = await getSpeechConfig();
    speechConfig.speechRecognitionLanguage = window._GLOBAL_SETTINGS.locale;
    const audioConfig = SpeechSDK.AudioConfig.fromMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    recognizerRef.current = recognizer;
    setMicState(true);

    // setTip(tipCont.speak[window._GLOBAL_SETTINGS.locale]);

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        displayText = result.text;
        console.log("speech text:", displayText);
        setMicState(false);
        // wsSend({ type: 101, message: displayText });
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
        setMicState(false);
        setTip("");
        alert(displayText);
      }
    });
  }, [micState]);

  const clearInputArea = React.useCallback((blur = false) => {
    (inputAreaRef.current as HTMLDivElement).innerText = "";
    blur && (inputAreaRef.current as HTMLDivElement).blur();
  }, []);

  const onPaste = React.useCallback((event: React.ClipboardEvent) => {
    event.preventDefault();
    let pasteText = event.clipboardData?.getData("text").trim();
    document.execCommand("insertText", false, pasteText);
  }, []);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.code === "Enter" || event.key === "Enter") {
        event.preventDefault();
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          document.execCommand("insertText", false, "\n");
        } else {
          handleSendMessage();
        }
      }
    },
    [handleSendMessage]
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setText((inputAreaRef.current as HTMLDivElement).innerText);
    });
    observer.observe(inputAreaRef.current as HTMLDivElement, {
      characterData: true,
      subtree: true,
      childList: true,
    });
  }, []);

  return (
    <AppBar
      className="inputBox"
      position="absolute"
      color="default"
      sx={{ top: "auto", bottom: 0, display: "flex" }}
    >
      <Toolbar variant="dense" sx={{ flexGrow: 1, gap: 1 }}>
        <div
          className="ipt"
          contentEditable={true}
          ref={(ref) => (inputAreaRef.current = ref)}
          onPasteCapture={onPaste}
          onKeyDownCapture={onKeyDown}
          onFocusCapture={() => setFocusState(true)}
          onBlurCapture={() => setFocusState(false)}
        ></div>
        <Zoom
          in={!isFocus}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${isFocus ? 0 : transitionDuration.exit}ms`,
          }}
        >
          <Fab
            aria-label="Microphone"
            color={micState ? "success" : "primary"}
            onClick={sttFromMic}
            sx={{
              position: "absolute",
              top: -80,
              left: 0,
              right: 0,
              margin: "auto",
            }}
          >
            <MicIcon />
          </Fab>
        </Zoom>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => {
            clearInputArea();
            handleSendMessage(text);
          }}
          size="small"
        >
          Send
        </Button>
      </Toolbar>
    </AppBar>
  );
});
