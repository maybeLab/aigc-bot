import React from "react";

import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Send, Mic, CloseOutlined } from "@mui/icons-material";

import Typography from "@mui/material/Typography";

import {
  SpeechSDK,
  getSpeechConfig,
  ResultReason,
  AutoDetectSourceLanguageConfig,
} from "@/utils/speech";

export default React.memo(function TextInput({ handleSendMessage }: any) {
  const theme = useTheme();
  const inputAreaRef = React.useRef<HTMLSpanElement | null>();
  const [text, setText] = React.useState("");

  const recognizerRef: any = React.useRef();
  const [micState, setMicState] = React.useState(false);
  const [micLoading, setMicLoading] = React.useState(false);

  const sttFromMic = React.useCallback(async () => {
    try {
      if (micState === true) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        setMicState(false);
        return;
      }
      setMicLoading(true);
      const speechConfig = await getSpeechConfig();
      const audioConfig = SpeechSDK.AudioConfig.fromMicrophoneInput();
      const recognizer = SpeechSDK.SpeechRecognizer.FromConfig(
        speechConfig,
        AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "zh-CN"]),
        audioConfig
      );
      recognizerRef.current = recognizer;
      setMicLoading(false);
      setMicState(true);

      recognizer.canceled = (_, event) => {
        setMicState(false);
      };

      recognizer.recognized = (_, event) => {
        if (event.result.reason !== ResultReason.NoMatch) {
          (inputAreaRef.current as HTMLSpanElement).insertAdjacentText(
            "beforeend",
            event.result.text
          );
        }
      };

      recognizer.startContinuousRecognitionAsync();
    } catch (error) {
      setMicLoading(false);
      setMicState(false);
    }
  }, [micState]);

  const clearInputArea = React.useCallback((blur = false) => {
    (inputAreaRef.current as HTMLDivElement).innerText = "";
    blur && (inputAreaRef.current as HTMLDivElement).blur();
  }, []);

  const handleSubmit = React.useCallback(() => {
    handleSendMessage(text, clearInputArea.bind(null, true));
  }, [clearInputArea, handleSendMessage, text]);

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
          handleSubmit();
        }
      }
    },
    [handleSubmit]
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
      <Toolbar variant="dense" sx={{ flexGrow: 1, gap: 1, p: 1 }}>
        <LoadingButton
          variant="outlined"
          onClick={sttFromMic}
          disabled={micLoading}
          sx={{
            width: "36px",
            minWidth: 4,
            borderRadius: "50%",
          }}
          loading={micLoading}
        >
          {micState ? <CloseOutlined /> : <Mic />}
        </LoadingButton>
        <Typography
          className={`ipt ${micState && !micLoading ? "loading" : ""}`}
          sx={{
            alignSelf: "stretch",
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
          variant="body2"
          contentEditable={true}
          ref={(ref) => (inputAreaRef.current = ref)}
          onPasteCapture={onPaste}
          onKeyDownCapture={onKeyDown}
        ></Typography>

        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSubmit}
          size="medium"
        >
          Send
        </Button>
      </Toolbar>
    </AppBar>
  );
});
