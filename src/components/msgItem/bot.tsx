import React, { useEffect, memo } from "react";
import formatter from "@/utils/formatter";

import speak from "./tts";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

import { stringAvatar } from "@/utils";
import Store from "@/context";

function MsgItemBot(props: any) {
  const { state } = React.useContext(Store);
  const [content, setContent] = React.useState(formatter(props.content));

  const textToSpeech = (text: string) => {
    speak(text);
  };

  useEffect(() => {
    setContent(formatter(props.content));
  }, [props]);

  return (
    <ListItem alignItems="center">
      <ListItemAvatar sx={{ alignSelf: "flex-start" }}>
        <Avatar {...stringAvatar(state.conversation.name)}></Avatar>
      </ListItemAvatar>

      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          width: "calc(100% - 56px - 32px - 16px)",
        }}
      >
        <IconButton
          color="secondary"
          aria-label="speak"
          size="small"
          onClick={() => {
            textToSpeech(props.content);
          }}
          sx={{ verticalAlign: "sub" }}
          edge="start"
        >
          <RecordVoiceOverIcon fontSize="inherit" />
        </IconButton>
        <span
          className="marked"
          dangerouslySetInnerHTML={{ __html: content }}
        ></span>
      </Typography>
    </ListItem>
  );
}

export default memo(MsgItemBot);
