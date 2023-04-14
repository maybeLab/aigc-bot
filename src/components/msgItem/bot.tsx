import React, { useEffect, memo } from "react";
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

  const textToSpeech = (text: string) => {
    speak(text);
  };

  useEffect(() => {
    props.startAutoSpeech === true && textToSpeech(props.content);
  }, [props]);

  return (
    <ListItem alignItems="center" sx={{ pr: 8 }}>
      <ListItemAvatar sx={{ alignSelf: "flex-start" }}>
        <Avatar {...stringAvatar(state.conversation.name)}></Avatar>
      </ListItemAvatar>

      <Typography variant="body2">
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
        {props.content}
      </Typography>
    </ListItem>
  );
}

export default memo(MsgItemBot);
